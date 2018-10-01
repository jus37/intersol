<template>
    <div class="container">
        <h3>Online:</h3>
        <div class="user" v-for="user in users" @click="selectUser(user)">
            <img :src="user.photo_50"/>
            <div>{{user.first_name}} {{user.last_name}}</div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "Users",
    computed: {
      users() {
        return this.$store.state.users
      }
    },
    methods: {
      selectUser(user) {
        this.$store.commit('setPrivateChat', user)
      }
    }
  }
</script>

<style scoped>
    .container {
        border-left: 1px solid #dcdcdc;
        padding: 0 5px;
        height: 100%;
    }

    .user {
        margin: 3px 0;
        padding: 3px;
        display: flex;
        font-size: 16px;
        border-radius: 2px;
        transition: .2s;
    }
    
    .user:hover {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.05);
    }

    .user img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 8px;
    }
</style>