<template>
  <div>
    <img src="../assets/main.webp" class="logo" alt="logo" />
    <div class="bottom-info">
        <p>BUG反馈：B站私信&nbsp&nbsp<a href="https://space.bilibili.com/34077070" target="_blank">上神Hestia</a></p>
        <p>服务器支持：<a href="https://space.bilibili.com/6690298" target="_blank">第一个mt</a></p>
        <p></p>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 500px;
  padding: 32px;
}

.bottom-info{
  background-color: whitesmoke;
  padding: 4px;
  width: 100%;
  box-sizing: border-box;
  bottom: 0; /* 距离底部 0px */
  left: 0; /* 距离左侧 0px */
}

.bottom-info p{
  margin: 4px 0;
  padding: 0;
  font-size: 14px;
}

.bottom-info a {
  text-decoration: none; /* 去掉下划线 */
  color: inherit; /* 继承父元素的字体颜色 */
  font-size: inherit; /* 继承父元素的字体大小 */
  font-family: inherit; /* 继承父元素的字体家族 */
  font-weight: inherit; /* 继承父元素的字体粗细 */
  transition: color 300ms;
}

.bottom-info a:hover{
    color: #909090;
}
</style>