# build stage
# 环境node：10
FROM node:10 
# 谁来维护这个项目
LABEL maintainer=1127071993@qq.com
# 创建一个工作目录（在docker镜像内创建）
WORKDIR /app
# COPY package*.json ./
# 复制当前目录下的所有文件到镜像中来
COPY . .
#RUN npm install --registry=https://registry.npm.taobao.org    也可以设置淘宝镜像源
RUN npm install
# COPY . .

# 产生了dist目录，server.bundle.js文件
RUN npm run build
# 暴露 node服务 12005端口，在node服务入口那里设置端口号，生产：12005，开发：3000
EXPOSE 12005
# 静态资源目录
VOLUME ["/app/public"]
# 使用node运行dist/server.bundle.js的命令
CMD ["node","dist/server.bundle.js"]