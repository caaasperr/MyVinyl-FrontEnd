<template>
    <header>
        <div class="title_nav">
            <router-link to="/vinyl"><div class="nav_item">Vinyl</div></router-link>
            <router-link to="/shelves"><div class="nav_item">Shelves</div></router-link>
            <router-link to="/profile"><div class="nav_item">Profile</div></router-link>
        </div>
        <a href="https://recordbox.org/" class="title">RecordBox</a>
        <div class="username">{{ username }}</div>
    </header>
</template>
<script>
export default {
    name: "HeaderComponent",
    data() {
        return {
            username: '',
        }
    },
    mounted() {
        this.username = localStorage.getItem('username');
    }
}
</script>

<style scoped>
header {
    display: flex;
    width: 100vw;
    height: 50px;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #2a2e32;
    position: relative;
}
.title_nav {
    display: flex;
    position: absolute;
    left: 0;
    margin-left: 20px;
}
.nav_item {
    font-size: 15px;
    margin-left: 15px;
    margin-right: 15px;
    text-decoration: none;
}

.username {
    position: absolute;
    right: 0;
    margin-right: 40px;
    font-weight: 600;
}

.title {
    font-family: Bebas Neue;
    font-size: 35px;
    font-weight: 100;
    text-decoration: none;
    color: #2a2e32;
}

a {
    text-decoration: none;
    color: inherit;
}
</style>