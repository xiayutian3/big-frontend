FROM node:12-alpine 
# 谁来维护这个项目
LABEL maintainer=1127071993@qq.com
# 创建一个工作目录（在docker镜像内创建）
WORKDIR /app
# COPY package*.json ./
# 复制当前目录下的所有文件到镜像中来
COPY . .
#RUN npm install --registry=https://registry.npm.taobao.org    也可以设置淘宝镜像源（因为我们在国内环境，最好使用淘宝源，或者cnpm）
#RUN npm install cnpm -g --no-progress --registry=https://registry.npm.taobao.org   //也可以加上  --no-progress  不去打印进程

RUN npm install
# RUN cnpm install --no-progress    //安装依赖，不打印进程
# COPY . .

# 产生了dist目录，server.bundle.js文件
RUN npm run build
# 暴露 node服务 12005端口，在node服务入口那里设置端口号，生产：12005，开发：3000
EXPOSE 12005
# # 静态资源目录(挂在静态资源目录出来)
VOLUME ["/app/public"]
# # 使用node运行dist/server.bundle.js的命令
CMD ["node","dist/server.bundle.js"]
