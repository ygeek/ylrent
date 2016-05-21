# 源涞Web项目

## 开发工具链

### ECMA2015
- babel
- eslint

### CSS extension
- SASS

### 自动化构建工具：gulp

#### 已实现的自动化任务：
1. images: 图片压缩
2. styles: 编译SASS & sourcemap => autoprefix => minify
3. scripts: 编译ECMA2015 & sourcemap => minify
4. files: 拷贝相关文件
5. fonts: 转换字体文件类型，修改CSS文件中相关代码
6. bower: concatenate & minify bower javascript => 移动到目标目录
7. lint: lint所有源码文件
8. transpile: 编译所有源码文件
9. views: 拷贝所有view文件到目标目录
10. ln: symlink package.json & node_modules到目标目录
11. clean: 清除build目录
12. clear: 清除缓存
13. tasks: 显示所有tasks

### 后端包管理：npm
第三方库依赖：

- jquery
### 前端包管理：bower
第三方库依赖：

- body-parser
- compression
- cookie-parser
- ejs
- express
- express-session
- glob
- helmet
- lodash
- log4js
- moment
- mongoose
- mongoose-paginate
- passport
- passport-local
- passport-local-mongoose
- request
- serve-favicon


