import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const HomeScreen = ({ navigation, route }) => {
    const { user } = route.params || {};


    const recentSuggestions = [
        { id: 1, meal: '鶏むね肉のサラダ', mood: '疲れた' },
        { id: 2, meal: 'ビタミンたっぷりスムージー', mood: '元気' },
        { id: 3, meal: 'おかゆ', mood: '胃もたれ' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>気分で選ぶ食事AI</Text>

            {user?.name && (
                <Text style={styles.welcome}>ようこそ、{user.name}さん！</Text>
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('MoodInputScreen', { user })}
            >
                <Text style={styles.buttonText}>気分・体調を入力する</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.historyButton}
                onPress={() => navigation.navigate('HistoryScreen', { user })}
            >
                <Text style={styles.historyButtonText}>履歴をみる</Text>
            </TouchableOpacity>




            <Text style={styles.subTitle}>最近の提案</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recentSuggestions.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <Text style={styles.cardTitle}>{item.meal}</Text>
                        <Text style={styles.cardMood}>気分：{item.mood}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
        paddingTop: 64,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 32,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginBottom: 24,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
    card: {
        backgroundColor: '#F0F0F0',
        padding: 16,
        borderRadius: 12,
        marginRight: 12,
        minWidth: 180,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    cardMood: {
        fontSize: 14,
        color: '#555',
        marginTop: 8,
    },

    historyButton: {
        backgroundColor: '#ddd',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginBottom: 24,
    },
    historyButtonText: {
        color: '#333',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },

});

export default HomeScreen;
