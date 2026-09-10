---
title: Insightface换脸——安装到实现全过程
description: 复导项目记录
publishedAt: 2023-11-05
tags:
  - InsightFace
  - Python
  - 深度学习
  - 计算机视觉
---
备注：搬了一篇古早博客。当时还没有AI，出bug全靠CSDN和博客园。因此这篇博客大部分篇幅是配环境和调bug，主要作用是个人记录。
### ~~为什么还要两周就要考NOIP了有人还在摸鱼写两周前的复导代码啊~~

### [github项目](https://github.com/deepinsight/insightface)
### [insightface官网](https://insightface.ai/)

## 一、安装依赖库

这段是整个过程中耗时最长问题最多的，前前后后用半天时间，也翻了几百个网页才最终安装成功。

### 1.安装cv2
参考[这篇博客](https://blog.csdn.net/qq_40757322/article/details/103581456)
打开cmd，先升级pip：
`python -m pip install --upgrade pip`
再安装cv2:
`pip install opencv-python`
然而，这个命令过后实在是太慢了 而且容易出现ERROR
于是我翻到了cv2的[镜像源](https://blog.csdn.net/weixin_43368077/article/details/106709599)：
`pip install -i https://pypi.tuna.tsinghua.edu.cn/simple opencv-python`
安装成功！

### 2.安装……insightface?
是的我本来以为安装库两步就结束了。但是，“这不过是个开场”。
参考[这篇博客](https://blog.csdn.net/july_Ai/article/details/132469861)和[这篇文章](https://wenku.csdn.net/answer/7s0i2w8v2v)(这篇文章昨天还可以免费看，今天好像就要会员了),我发现要装很多依赖库。

### 3.安装numpy
这个我之前装过了，没有出太大问题
`pip install numpy`
当然也可以[升级一下](https://blog.csdn.net/stronglyh/article/details/99553236)
`pip install --upgrade numpy`

### 4.安装mxnet
参考[这篇博客](https://blog.csdn.net/weixin_45755816/article/details/121755277)
`pip install mxnet`
然后……
![](https://img2023.cnblogs.com/blog/2669443/202311/2669443-20231105101242958-193662911.jpg)
没有轮子……那怎么办呢？
我看到了[这篇博客](https://blog.csdn.net/qq_45296929/article/details/106174973)
于是到达了[这个网站](https://www.lfd.uci.edu/~gohlke/pythonlibs/)手动下载。
并同时安装了mxnet、numpy和torch的whl文件，安装了两个小时左右。
最后直接在cmd里面pip install whl文件，然后……numpy和torch的都安装失败了，不过mxnet的安装成功了。
最后照例使用[镜像源](https://www.cnblogs.com/liuwenhua/p/11537090.html)安装:
`pip install -i https://pypi.doubanio.com/simple/ mxnet-cu100`

### 5.安装insightface
断断续续弄了小半天之后终于切入正题！
`pip install insightface`
这里没有用镜像源，直接装速度不算慢
但是还是因为网络问题报错了好几次，重复输入几遍就好了
然后……
“failed building wheel for insightface”
又是whl文件出了问题。
于是经过一番搜索与辗转之后，我找到了[github](https://github.com/deepinsight/insightface/issues/2340)和[stackoverflow](https://stackoverflow.com/questions/76739044/how-to-fix-this-issue-error-failed-building-wheel-for-insightface)上的解决方法——
![](https://img2023.cnblogs.com/blog/2669443/202311/2669443-20231105114826364-1963449294.jpg)
![](https://img2023.cnblogs.com/blog/2669443/202311/2669443-20231105124400125-490716773.jpg)
点击[这个网站](https://aka.ms/vs/17/release/vs_BuildTools.exe)下载vs
安装时勾选Windows SDK和C++ x64/x86 build tools
然后顺利解决啦~撒花✿✿ヽ(°▽°)ノ✿

## 二、程序运行

### 1.代码部分
贴一下我跑的代码~由复旦大学钱振兴教授提供，在此表示衷心感谢！

```python
import numpy as np
import os
import cv2
import insightface
from insightface.app import FaceAnalysis

def get_max_face(app,img):
    faces=app.get(img)
    if len(faces)<1:
        return False
    areas=[]
    for face in faces:
        bbox=face['bbox']
        area=abs((bbox[0]-bbox[2])*(bbox[1]-bbox[3]))
        areas.append(area)
    index=np.argmax(areas)
    return faces[index]

base_path=os.getcwd()
if __name__=='__main__':
    app=FaceAnalysis(name='buffalo_l',root=base_path)
    app.prepare(ctx_id=0,det_size=(640,640))
    
    name=os.path.join(base_path,'models',"inswapper_128.onnx")
    swapper=insightface.model_zoo.get_model(name,root=base_path)
    
    img_src=cv2.imread("zty.jpg")
    face_src=get_max_face(app,img_src)
    
    img_tgt=cv2.imread("hxt.jpg")
    face_tgt=get_max_face(app,img_tgt)
    
    if face_tgt is None or face_src is None:
        print("-------no face-------")
    else:
        res=img_tgt.copy()
        res=swapper.get(res,face_tgt,face_src,paste_back=True)
        
        cv2.imwrite("out.jpg",res)
        cv2.imshow("out",res)
        cv2.waitKev(0)

```

### 2.buffalo_l模型安装
调了一些bug之后程序跑起来了，然后……
![](https://img2023.cnblogs.com/blog/2669443/202311/2669443-20231105115131584-81467049.jpg)
看起来因为没有仔细阅读官方文档，忘记装buffalo_l模型了，于是程序开始自动帮我下载。推测一大串报错可能是因为下载网络错误导致的。因此我决定沿着前两行的下载地址进行手动下载。
自动跳转到了[这个网页](https://sourceforge.net/projects/insightface.mirror/)开始下载。下载了两三个小时后终于下下来了。（然后突然想到其实可以找国内资源的，哭qaq）

### 3.inswapper128模型安装
再跑了一遍程序，然后……
![](https://img2023.cnblogs.com/blog/2669443/202311/2669443-20231105121052909-1768457412.jpg)
还忘记装inswapper128模型了。参考这篇博客，这是他的[官方网站](https://huggingface.co/henryruhs/roop/resolve/main/inswapper_128.onnx)。
但是我不想再挂一个梯子龟速下载了。于是我找到了[这个](https://www.123pan.com/s/sKd9-YxIc.html)。快速又高效！

### 4.结果展示
备注：这一部分涉及个人隐私。原文为私密发表，本文中删去。
## 三、结语
本项目是复导officehour的一个教学程序。在此再次感谢fdu与shs提供的资源！
项目的构建大部分参考了网络资源，实际上看过的博客文章远比本篇博客中的多，上文列举了大部分有帮助的博客。
最后，
### NOIP2023RP++!