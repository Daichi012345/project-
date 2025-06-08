import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [allergy, setAllergy] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('入力エラー', '名前・メール・パスワードを入力してください');
      return;
    }
    //↓ip変更
    try {
      const response = await fetch('http://10.38.169.215:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          age: Number(age),
          gender: gender.trim(),
          allergy: allergy.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('登録完了', 'ログインしてください');
        navigation.navigate('Login'); // ✅ ここでログイン画面へ遷移
      } else {
        Alert.alert('登録失敗', data.message || 'サーバーエラー');
      }
    } catch (error) {
      console.error('登録エラー:', error);
      Alert.alert('通信エラー', 'もう一度お試しください');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ユーザー登録</Text>

      <TextInput placeholder="名前" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="メールアドレス" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput placeholder="パスワード" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput placeholder="年齢" style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />
      <TextInput placeholder="性別（例：男性 / 女性 / その他）" style={styles.input} value={gender} onChangeText={setGender} />
      <TextInput placeholder="アレルギー（例：卵, 乳）" style={styles.input} value={allergy} onChangeText={setAllergy} />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>登録する</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>すでにアカウントをお持ちですか？ログイン</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: {
    color: 'blue',
    marginTop: 10,
    textAlign: 'center'
  }
});

export default RegisterScreen;
