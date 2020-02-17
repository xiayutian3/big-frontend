'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the astonishing ${chalk.red('generator-imooc-gulpd')} generator!`)
    );

    const prompts = [
      {
        type: 'confirm',
        name: 'install',//name改为install
        message: 'Would you like to enable this option?',
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('**'),  //当前的模板，**：templates所有文件,都复制到gennerator去
      this.destinationPath('./') //输出当前文件夹下
    );
  }

  install() {
    this.installDependencies({
      bower: false     //下载脚手架的时候（因为脚手架除了npm依赖，还有其它一些包安装工具）
    });                 //，报了个错npm install && bower install，说要我们安装bower，用npm安装的话，就不需要了bower包安装工具了
  }                     //关掉 bower依赖
};
