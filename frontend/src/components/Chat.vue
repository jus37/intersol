<template>
    <div class="container">
        <Row v-if="!auth">
            <Col span="18" offset="3" class="auth-message">
                <h3>Авторизуйтесь, чтобы начать общаться:</h3>
                <img src="https://pp.userapi.com/c852028/v852028593/14048/8LRgw-x56a8.jpg" @click="vkAuth"/>
            </Col>
        </Row>

        <div class="private-title" v-if="privateChat">
            <Icon type="ios-arrow-back" size="40" @click="closePrivateChat"/>
            <img :src="privateChat.photo_50"/>
            <h3>{{privateChat.first_name}} {{privateChat.last_name}}</h3>
        </div>

        <h2 v-if="!messages.length" style="text-align: center; margin-top: 30px">Здесь пока пусто ...</h2>

        <div class="chat">
            <div class="message" v-for="message in messages">
                <img :src="message.user.photo_50"/>
                <div class="message-text">
                    <div class="message-author">{{message.user.first_name}} {{message.user.last_name}}</div>
                    <div class="message-text">{{message.text}}</div>
                </div>
                <div>
                    {{getMessageDate(message.date)}}
                </div>
            </div>
        </div>
        <Input suffix="md-send" placeholder="Сообщение" v-model="message" ref="input" autofocus @on-enter="sendMessage"/>
    </div>
</template>

<script>
  import dateFormat from 'dateformat'
  import {parseCookies} from '../utils'

  export default {
    name: "Chat",
    data() {
      return {
        auth: false,
        message: null
      }
    },
    mounted() {
      this.chatContainer = document.querySelector(".chat");
    },
    created() {
      const cookie = parseCookies(document.cookie);
      this.auth = !!cookie.user;
    },
    methods: {
      vkAuth() {
        window.location.replace("/vkauth");
      },
      sendMessage() {
        if (!this.message)
          return;

        this.message = this.message.trim();

        this.$socket.emit('message', {
          chat: this.privateChat,
          text: this.message
        });
        this.message = null;
      },
      closePrivateChat() {
        this.$store.commit('setPrivateChat', null)
      },
      getMessageDate(date) {
        return dateFormat(date, "HH:MM dd.mm.yy")
      }
    },
    updated() {
      this.chatContainer.scrollTo(0,this.chatContainer.scrollHeight);
    },
    computed: {
      messages() {
        return this.$store.state.messages
      },
      privateChat() {
        const privateChat = this.$store.state.privateChat;
        this.$store.commit('setMessages', []);
        this.$socket.emit('messagesHistory', privateChat);
        if(this.$refs.input)
          this.$refs.input.focus();
        return privateChat;
      }
    }
  }
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0 5px;
    }

    .auth-message {
        text-align: center;
        margin-bottom: 10px;
        padding-bottom: 5px;
        border-bottom: 1px solid #dcdcdc;
    }

    .auth-message img {
        height: 30px;
        width: 30px;
        transition: .1s;
    }

    .auth-message img:hover {
        cursor: pointer;
        transform: scale(1.1);
    }

    .chat {
        flex-grow: 1;
        margin-bottom: 5px;
        overflow-y: auto;
    }

    .message {
        margin: 3px 0;
        padding: 3px;
        display: flex;
    }

    .message-text {
        flex-grow: 1;
    }

    .message img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 8px;
    }

    .message-author {
        font-size: 14px;
        color: grey;
        font-weight: bold;
    }

    .private-title {
        color: grey;
        display: flex;
        align-items: center;
        height: 70px;
        padding-bottom: 5px;
        border-bottom: 1px solid #dcdcdc;
    }

    .private-title img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 8px;
    }
    
    .private-title i:hover {
        cursor: pointer;
        color: rgba(0, 0, 0, 0.9);
    }
</style>