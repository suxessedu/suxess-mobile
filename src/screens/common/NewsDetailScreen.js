import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';

export default function NewsDetailScreen() {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { newsId, title } = route.params;
  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchNewsDetail();
  }, [newsId]);

  const fetchNewsDetail = async () => {
    try {
      const response = await api.get(`/news/${newsId}`);
      setNews(response.data);
    } catch (error) {
      console.log('Error fetching news detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!news) {
    return (
        <View style={styles.center}>
            <Text>Failed to load news.</Text>
        </View>
    )
  }

  const tagsStyles = {
    body: {
      color: '#333',
      fontSize: 16,
      lineHeight: 24,
    },
    img: {
      borderRadius: 8,
      marginVertical: 10,
    },
    p: {
      marginBottom: 10,
    },
    ul: {
      marginBottom: 10,
      marginLeft: 20,
    },
    ol: {
        marginBottom: 10,
        marginLeft: 20,
    },
    h1: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
    h2: { fontSize: 20, fontWeight: 'bold', marginVertical: 8 },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
         </TouchableOpacity>
         {/* Truncate long titles in header */}
         <Text style={styles.headerTitle} numberOfLines={1}>
             {news.title}
         </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{news.title}</Text>
        <View style={styles.meta}>
            <Text style={styles.date}>📅 {news.createdAt}</Text>
            <Text style={styles.author}>✍️ {news.authorName}</Text>
        </View>
        
        <View style={styles.divider} />

        <RenderHtml
          contentWidth={width - 40}
          source={{ html: news.content }}
          tagsStyles={tagsStyles}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginLeft: 15,
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  meta: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  date: { color: '#666', fontSize: 13 },
  author: { color: '#666', fontSize: 13 },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 20,
  },
});
