<template>
  <div class="modalBackground">
    <div class="modal">
      <header>
        <slot name="header"></slot>
      </header>
      <main>
        <slot name="body"></slot>
      </main>
      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalComponent",
};
</script>

<style scoped>

.modalBackground {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  /*display: flex;
  align-items: center;
  justify-content: center;*/
  background-color: #2a2e321f;
}

.modal {
  padding: 10px 0px 0px 0px;
  background-color: white;
  width: fit-content;
  margin: 0 auto;
  margin-top: 200px;
  border: 1px solid #2a2e32;
}

header {
  padding: 0px 20px;
  font-size: 25px;
}

main {
  padding: 0px 20px;
  display: flex;
  flex-direction: column;
}

footer {
  width: 100%;
  border-top: 1px solid #2a2e32;
  display: flex;
  margin-top: 20px;
}
</style>