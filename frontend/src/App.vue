<template>
  <div id="app">
    <Layout>
      <Row>
        <Col span="14" offset="2" class="main">
          <Chat></Chat>
        </Col>
        <Col span="6" class="main">
          <Users></Users>
        </Col>
      </Row>
    </Layout>
  </div>
</template>

<script>

import Chat from "./components/Chat";
import Users from "./components/Users";
export default {
  name: 'app',
  components: {Users, Chat},
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .main {
    height: calc(100vh - 60px);
    margin-top: 30px;
    margin-bottom: 30px;
  }
</style>
