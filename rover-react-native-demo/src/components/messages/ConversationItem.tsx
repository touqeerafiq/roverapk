import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Text, Badge } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { format, isToday, isYesterday } from 'date-fns';

import { theme } from '../../utils/theme';

interface ConversationItemProps {
  conversation: {
    id: string;
    otherUser: {
      id: string;
      name: string;
      photoURL?: string;
    };
    lastMessage: {
      text: string;
      timestamp: string;
      senderId: string;
    };
    unreadCount: number;
  };
  currentUserId: string;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, currentUserId }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Conversation', { conversationId: conversation.id });
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };

  const isOwnMessage = conversation.lastMessage.senderId === currentUserId;

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Avatar.Image
        source={
          conversation.otherUser.photoURL
            ? { uri: conversation.otherUser.photoURL }
            : require('../../assets/default-avatar.png')
        }
        size={50}
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{conversation.otherUser.name}</Text>
          <Text style={styles.time}>{formatMessageTime(conversation.lastMessage.timestamp)}</Text>
        </View>
        
        <View style={styles.messageContainer}>
          <Text
            style={[
              styles.message,
              isOwnMessage && styles.ownMessage,
              conversation.unreadCount > 0 && !isOwnMessage && styles.unreadMessage,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {isOwnMessage ? 'You: ' : ''}{conversation.lastMessage.text}
          </Text>
          
          {conversation.unreadCount > 0 && (
            <Badge style={styles.badge}>{conversation.unreadCount}</Badge>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: '#757575',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    fontSize: 14,
    color: '#757575',
    flex: 1,
  },
  ownMessage: {
    fontStyle: 'italic',
  },
  unreadMessage: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: theme.colors.primary,
    marginLeft: 10,
  },
});

export default ConversationItem;