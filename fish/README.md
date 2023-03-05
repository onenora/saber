## Fastest terminal based on fish alacritty 
```
curl -fLo ~/.config/alacritty/alacritty.yml --create-dir \
     https://gw.alipayobjects.com/os/k/j2/alacritty.yml
```

```     
command + r：清屏，清理掉历史命令行的显示
command + w: 隐藏，默认是直接quit了，这里改成隐藏
command + t:  新开窗口，假如需要第二个终端窗口
command + shift+w：关闭当前窗口
command + delete：删除一行
command + f：搜索关键字
command + ←：跳到行首
command + →：跳到行尾
```

```
# 1. 首先安装 tmux
brew install tmux
# 2. 下载tmux配置问题到本地位置
curl -fLo ~/.tmux.conf \
    https://gw.alipayobjects.com/os/k/8b/.tmux.conf
# 3. 重新替换一下 alacrittye 配置文件
curl -fLo ~/.config/alacritty/alacritty.yml --create-dir \
     https://gw.alipayobjects.com/os/k/l9/alacritty.yml
```

```
command + t：新开标签页
command + w: 关闭标签页
command + 数字：跳转对应标签页
command + shift + [ ：切换到上一个标签页
command + shift + ] ：切换到下一个标签页
```