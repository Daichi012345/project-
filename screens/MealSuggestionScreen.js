import React, { useState, useEffect } from 'react';


import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { translateText } from '../utils/openai';

export default function MealSuggestionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { meal, user } = route.params || {};
  const [loading, setLoading] = useState(false);

  const saveRecommendation = async (isFavorite) => {
    if (!user || !user._id) {
      Alert.alert('エラー', 'ユーザー情報がありません（ログインが必要です）');
      return;
    }
    //↓ip変更
    try {
      const response = await fetch('http://10.38.169.215:3000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          meal: meal.name,
          mood: meal.mood || '未設定',
          isFavorite,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert(isFavorite ? 'お気に入りに追加しました' : '保存しました');
      } else {
        Alert.alert('エラー', data.message || '保存に失敗しました');
      }
    } catch (error) {
      Alert.alert('通信エラー', error.message);
    }
  };

  useEffect(() => {
    const saveToHistory = async () => {
      if (!user || !meal) return;
      try {
        await fetch('http://10.38.169.215:3000/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            meal: meal.name,
            mood: meal.mood || '未設定',
            isFavorite: false, // 自動保存時はお気に入りではない
          }),
        });
        console.log('✅ 自動保存成功');
      } catch (err) {
        console.error('❌ 自動保存失敗:', err);
      }
    };

    saveToHistory();
  }, []);


  const handleRecipeView = async () => {
    setLoading(true);
    try {
      const originalInstructions = meal.instructions?.includes('There is no procedural information.')
        ? meal.summary
        : meal.instructions || meal.summary;

      const translatedInstructions = await translateText(originalInstructions);
      const translatedSummary = await translateText(meal.summary || '');
      const translatedIngredients = meal.ingredients
        ? await Promise.all(meal.ingredients.map(item => translateText(item)))
        : [];

      navigation.navigate('RecipeDetailScreen', {
        name: meal.name,
        summary: translatedSummary,
        instructions: translatedInstructions,
        ingredients: translatedIngredients,
      });
    } catch (err) {
      console.error('翻訳失敗:', err);
      navigation.navigate('RecipeDetailScreen', {
        name: meal.name,
        summary: meal.summary,
        instructions: '手順情報を取得できませんでした。',
        ingredients: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>あなたへのおすすめ</Text>

      <Image source={{ uri: meal.image }} style={styles.image} />
      <Text style={styles.mealName}>{meal.name}</Text>

      <View style={styles.nutritionCard}>
        <Text style={styles.nutritionTitle}>栄養成分（1食あたり）</Text>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionLabel}>カロリー</Text>
          <Text style={styles.nutritionValue}>{meal.nutrition.calories} kcal</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionLabel}>たんぱく質</Text>
          <Text style={styles.nutritionValue}>{meal.nutrition.protein} g</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionLabel}>脂質</Text>
          <Text style={styles.nutritionValue}>{meal.nutrition.fat} g</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => saveRecommendation(false)}>
          <Text style={styles.buttonText}>保存する</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.favoriteButton]} onPress={() => saveRecommendation(true)}>
          <Text style={styles.buttonText}>お気に入り</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#2196F3', marginTop: 16 }]}
        onPress={handleRecipeView}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? '翻訳中...' : 'レシピを見る'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 12, marginBottom: 16 },
  image: { width: '100%', height: 200, borderRadius: 16, marginBottom: 16 },
  mealName: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 20 },
  nutritionCard: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  nutritionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#333', textAlign: 'center' },
  nutritionItem: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  nutritionLabel: { fontSize: 14, color: '#555' },
  nutritionValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 20 },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  saveButton: { backgroundColor: '#4CAF50' },
  favoriteButton: { backgroundColor: '#FFA500' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
