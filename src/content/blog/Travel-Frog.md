---
title: 蛙蛙复活计划-日志
description: 2026.8-2026.9.6
publishedAt: 2026-09-10
tags:
  - 游戏
  - 逆向工程
  - WebSocket
  - Android
  - 本地服务器
---
2026.9.8得知[《旅行青蛙·中国之旅》在蛙蛙的下一个生日要停服了](https://www.xiaohongshu.com/discovery/item/6a9e720b000000002a024307?source=webshare&xhsshare=pc_web&xsec_token=ABLaaTihv77qsNrUuCYbGR7gm_Nq86trzBjLrIklkIk5U=&xsec_source=pc_share)，伤心了好一阵子。

<details>
<summary>点击查看详细内容</summary>

回想起高中时每周末上线收集明信片、装好背包；节气与节日的特殊食物与照片；以及在第一次收到北京的明信片时，发出的漂流瓶，“希望一年半之后，自己也能考到这个地方”。时间过得太快太快。高考完，我如愿考到了北京，把蛙蛙寄过来的照片全部印出来，收纳在一本相册，然后不再怎么上线。继续奔波辛劳地活着……几乎不想起以前。前一天半夜睡不着，打开小程序，看到蛙蛙回来了，在庭院里闭着眼睛淋雨——玩了几年，第一次解锁这个彩蛋。独在异乡，面对着日益内卷与异化的环境，我也不再感受雨，而只是被淋湿。曾经玩的时候心想总有一天会遇到这个场景，会集齐所有彩蛋……当时只道是寻常。

[其实小青蛙本会走散在2023年的春天](https://www.xiaohongshu.com/discovery/item/6aa138f70000000029011263?source=webshare&xhsshare=pc_web&xsec_token=ABs5_53BGyrZKd-7ixgcsQ6rUHr2PjbKLjRmQlmHfi8nw=&xsec_source=pc_share)

![](https://ik.imagekit.io/Amyxue/Homepage_Amy/blog_zS9Tj0ral)
![](https://ik.imagekit.io/Amyxue/Homepage_Amy/blog_IU-p97F7I)
![](https://ik.imagekit.io/Amyxue/Homepage_Amy/blog_xMlQgT0Vg)

**远行与回归……而回归的路更长。**

</details>

受到小红书用户[@呱命由我不由服](https://www.xiaohongshu.com/user/profile/5f8d8ac30000000001004b2d?xsec_token=ABoxzBu1ug8ZGpDDOzupST-TQQ8ZY_9InqQtJ_xnc_GNg=&xsec_source=pc_user)这篇备份游戏数据的[文章](https://www.xiaohongshu.com/explore/6aa16e1d000000002802ad82?xsec_token=ABs5_53BGyrZKd-7ixgcsQ6nS5pXXlrE_4WHMEtLw5rw8=&xsec_source=pc_user)的启发，决定开启《旅行青蛙·中国之旅》的离线保存项目，希望可以保留原客户端、资源和自己的存档，在2026.12.8停服后，让原来的客户端可以在本地服务器上运行。

该日志将持续更新该项目的进度与技术实现。由于版权原因，项目内容不公开。

# 2026.9.10

开启项目。电脑上安装了[雷电模拟器14](https://www.ldmnq.com/?)，可以模拟安卓环境。虽然应用商店已经将游戏下架，但是可以在[官网](https://wa.lingxigames.com/#/)上找到安装包apk。

## 1. 备份 APK 、应用私有数据、热更新资源

在真正开始写本地服务器之前，需要先尽可能把原始客户端、资源和自己的游戏数据完整留下来。

最先保存的是当前能够正常运行的 APK。《旅行青蛙·中国之旅》的 Android 客户端并不是把所有内容全部打包在 APK 里面。运行以后，它还会在应用私有目录中产生大量 SDK 数据、缓存、配置文件和后来下载的游戏资源。因此下一步是在有 root 权限的 Android 模拟器中，将整个应用私有目录打包保存。

大致流程是：
```text
/data/data/com.aligames.lxqw.hhb
        ↓
tar 打包
        ↓
复制到 /sdcard
        ↓
通过 adb pull 保存到电脑
```

最终备份出来的私有数据接近 100 MB。
里面除了常见的

```text
shared_prefs
files
code_cache
数据库
WebView 数据
SDK 数据
```

之外，还有两个后来非常重要的目录：

```text
files/games
files/jsdata
```

最开始我还怀疑 `shared_prefs` 或 SQLite 数据库中可能直接保存了完整游戏存档<例如应用中有一个体积比较大的`shared_prefs/localhost.xml`.但进一步检查后发现，它主要是 Egret 的 localStorage 数据，其中保存了资源版本记录、三叶草显示位置、本地公告以及一些客户端状态，并不是完整的角色存档。几个 SQLite 数据库也主要来自支付、日志、推送、下载器等 SDK，没有找到明显的核心游戏角色数据库。因而也可以看出，角色的主要状态并不完整地保存在 Android 本地，真正的存档必须继续从服务器端保存。

继续检查 `files/games` 后，发现这里其实保存了游戏运行时下载下来的大量热更新资源。
客户端访问过的资源 URL 被转换成了本地缓存路径。例如可以看到来自游戏热更新服务器的：

```text
release/lingxi/android/1083/
release/lingxi/android/1085/
```

其中包含：

```text
js/default.thm.js
js/main.min.js
resource/China/default.res.json
resource/China/config/gameConfig.json
各种图片、配置和 EAB 资源
```

`files/games` 中大约有几十 MB 的内容，这部分对于游戏保存非常关键。

也就是说，当前真正运行的客户端并不完全等于最初安装的 APK，而更接近：

```text
APK
+
运行时下载的热更新 JS
+
运行时下载的配置
+
运行时下载的资源文件
```

如果只保存 APK，将来重新安装以后，官方热更新服务器一旦关闭，客户端很可能无法再次获得这些内容。
因此我把当前已经下载到本机的热更新目录也作为项目的重要备份保存了下来。

## 2. 提取客户端逻辑 main.min.js

热更新资源中最关键的文件之一是`main.min.js`.
这个文件有一百多万字节，实际上包含了游戏绝大部分 Egret/TypeScript 编译后的 JavaScript 客户端逻辑。

通过阅读和搜索 `main.min.js`，逐渐能够找到：

```text
RoleModel
ItemModel
TravelModel
UserModel
FurnitureModel
协议列表 ProtocolList
WebSocket 管理代码
```

以及诸如：

```text
clover_harvest
item_buy
item_putin_bag
item_putin_desk
client_load_role
client_load_events
```

这样的具体游戏协议。

因此我保存了一份完全不修改的 `main.min.js`，然后所有实验都在它的副本上进行。

目前大致有：

```text
main.min.js
    原始基线

main.capture.js
    连接官方服务器
    额外输出协议日志

main.offline.js
    强制连接本地服务器

main.offline.stage5.js
    在离线版本基础上增加当前需要的本地协议扩展
```

## 3. 找到客户端自带的本地测试模式

阅读 `main.min.js` 时还发现了一件很有意思的事情：游戏本身其实保留了一个 `TestChannel`。代码中的默认配置甚至包含`ws://127.0.0.1:8080`以及一套不依赖正式渠道 SDK 的测试登录逻辑。正式运行时，这些配置会被线上配置覆盖，所以普通客户端最终还是连接官方服务器。但这意味着，我并不需要从零重新写一个 Android 客户端，也不必自己伪造正式渠道 SDK。只需要在自己的离线副本中，在最终配置阶段强制恢复：
```text
ChannelType.Test
ws://127.0.0.1:8080
```
原来的游戏客户端就能够主动连接一个本地 WebSocket 服务器。
这一发现后来成为整个离线方案的基础。

最终结构是：

```text
Android 模拟器中的原游戏客户端
        |
        | ws://127.0.0.1:8080
        |
     adb reverse
        |
        v
Windows 上的 Python WebSocket Server
```

## 4. 给客户端增加协议日志

接下来需要解决的问题是：
客户端代码虽然告诉我它会发送哪些协议，但是不知道官方服务器到底会返回什么。

因此我制作了一个`main.capture.js`.
这个版本仍然正常连接官方服务器，只是在原本的 Socket 日志代码旁边额外加入了自己的 `FROG` 日志标记。
因为 Android `logcat` 对单行日志长度有限制，所以一条较大的 JSON 协议不能直接完整打印。
最终采用的是分块方式：
```text
FROG|消息编号|分块编号|总分块数|内容
```
例如一条很长的服务器响应会变成：
```text
FROG|31|0|4|...
FROG|31|1|4|...
FROG|31|2|4|...
FROG|31|3|4|...
```
电脑端再通过 Python 脚本按照消息编号和分块编号重新拼接。

第一次给压缩后的 JavaScript 插入日志代码时，因为原代码处于一个逗号表达式中，我插入了不合适的分号，导致整个 `main.min.js` 出现 JavaScript SyntaxError，游戏直接无法运行，后来重新寻找更安全的插入位置才修好。

## 5. 第一次完整抓取登录后的初始化状态、数据脱敏

日志系统工作以后，下一步就是做一次最重要的抓取：
从启动游戏开始，一直到完全进入庭院，记录官方服务器发送的整个初始化过程。

最终这一次抓取成功重组出了几十条完整协议，而且没有出现丢失分块或 JSON 解析失败。

客户端登录完成后会发送：

```text
hall.login
hall.enter_game
annual.load
client.load_all_info
```

随后服务器连续主动推送大量初始化状态。
这部分数据包括：

```text
client.load_role
clover.load_clovers
item.load_items
item.load_shop_info
mail.load
travel.load_note
client.load_events
album.load_all
guest.load
story.load
furniture.load_furniture
weather.load
calendar.load
```

以及大量活动和其他系统的数据，总共获得了四十多类初始化 push。

其中最重要的几个是：

`client.load_role`包含角色基本信息、青蛙状态、三叶草数量、设置等；

`clover.load_clovers`包含草地中每一株三叶草的状态；

`item.load_items`包含仓库、背包、餐桌；

`item.load_shop_info`包含商店购买记录；

`client.load_events`包含当前尚未处理的旅行事件；

以及`album.load_all`、`mail.load`、`travel.load_note`等长期存档数据。

到这里，第一次真正获得了一份服务器端存档快照。

抓协议时还有一个必须注意的问题：登录阶段不可避免会经过正式服务器的账号和认证数据。所以后来写解析工具时，我把输出明确分成两类：

`LOCAL_ONLY`只保存在自己的电脑上，用于最大程度保存原始数据；

`SHARE_SAFE`用于分析、分享和后续记录。

安全版本会自动删除或替换：
```text
token
account
device id
IMEI
OAID
IP
正式登录数据
设备环境数据
```
等敏感字段。

之后分析单个动作时，也尽量只使用 `SHARE_SAFE` 文件，而不直接处理或者传播完整原始登录日志。


## 6. 本地服务器

### Stage 1.能够登录

拿到初始化快照后，才开始写第一版 Python WebSocket 服务器。

Stage 1 所完成的工作：

```text
客户端连接
↓
本地测试账号登录
↓
模拟 hall.login / hall.enter_game
↓
客户端发送 client.load_all_info
↓
把之前官方服务器的初始化 push 原样 replay
```

第一次看到原游戏客户端在**完全不连接官方服务器**的情况下正常进入庭院，是整个项目的第一个重要节点。

但这时它还只是一个“冻结的存档”。服务器每次启动都只会重新播放原来的快照，所以任何新的操作都无法永久保存。

也正是在这个基础上，后面才开始把 Stage 1 的静态 replay，一步一步改造成现在能够真实修改 `state.json` 的可写本地服务器。

### Stage2.开启备份

将初始化抓取的数据转换为了本地 `state.json`，之后服务器不再每次从原始抓包重新恢复，而是从这份本地状态文件加载。客户端的一些设置修改，例如`client.set_client`，已经可以直接写入本地状态。保存时还会自动保留历史备份，避免调试过程中破坏唯一存档。

### Stage3.收三叶草☘

在这个基础上，今天第一个真正实现的游戏操作是收三叶草。

为了确认官方服务器的真实行为，我在官方连接模式下只操作了一次普通三叶草，并单独记录这次动作的 WebSocket 协议。抓到的结果：客户端发送 `clover.harvest`，参数中包含 `clover_id`；服务器随后先发送 `clover.update` 更新三叶草总量，再返回包含 `clover_id` 的响应。

这也证明了一个很重要的思路：客户端源码可以告诉我“客户端会发什么”和“收到数据以后如何处理”，但服务器真正返回什么，仍然最好用实际协议来校准。

根据这次抓包，实现了 Stage 3。现在在本地服中收一棵普通三叶草后，服务器会修改三叶草总数，更新对应草的 `last_harvest`，保存到 `state.json`，再按照官方协议顺序向客户端发送 `clover.update` 和收获响应。

实际测试成功。收获前本地存档中的三叶草数量与官方快照一致，收一棵之后数量正确加一。关闭游戏和服务器后重新启动，新的数量仍然存在，说明这一操作已经不只是客户端 UI 上的临时变化，而是真正进入了本地存档。
### Stage4.背包和餐桌

这部分不需要再次抓官方协议，因为客户端代码已经把协议结构暴露得非常完整：`item.putin_bag`  
`item.takeout_bag`  
`item.putin_desk`  
`item.takeout_desk`

放入物品时发送位置和 `item_id`，取出时只发送位置。服务器同时维护 `house`、`bag` 和 `desk` 三份状态，并通过 `item.update` 向客户端同步仓库中物品的绝对数量。

测试中，物品可以正常从仓库放进背包或餐桌，再取回仓库；退出、重启服务器和重新进入游戏之后，位置和数量仍然正确。

### Stage5.普通商店购买

这里遇到了一个比较有意思的问题。官方客户端发送 `item.buy` 时，实际上只把 `shop_id` 发送给服务器。商品对应的 `item_id` 和价格都来自客户端自己的 `ShopDataDB`。

官方服务器当然知道每个 `shop_id` 对应什么商品，但本地服务器并没有官方服务端的配置数据库。因此我对“本地离线版客户端”的协议做了一个很小的扩展：本地模式下，`item.buy` 除了原来的 `shop_id`，还会把客户端已经知道的 `item_id` 和 `price` 一并发送给本地服务器。

这样服务器就能完整执行一次购买事务：三叶草扣除商品价格，仓库对应物品数量增加，商店购买次数增加，然后整体写入 `state.json`，最后通过 `clover.update` 和 `item.update` 同步给客户端。

实际测试同样成功。购买了 `shop_id=0` 的商品，价格为 10，服务器日志显示三叶草正确扣除，物品进入仓库；随后将该物品放进餐桌再取出，库存数量也始终正确。

### Stage6.旅行系统（进行中）
今天最后开始研究的是旅行系统。

目前已经确认，客户端把青蛙是否在家定义为：

`frog.status == 0`：在家  

`frog.status == 1`：外出

我当前保存下来的状态中，`frog.status=1`，游戏内确实只能看到餐桌，看不到背包。

还发现了一个很有意思的细节：青蛙外出以后，存档中的 `bag` 数组并不会立即清空，之前准备的物品仍然保留在那里，但 `bag_completed` 已经恢复为 `False`。客户端是否显示背包，主要由 `frog.status` 决定，而不是由 `bag` 是否为空决定。

背包点击“准备完成”时，客户端只会发送`item.set_bag_completed(true)`，但在完整协议列表里，没有找到类似 `travel.start` 或 `frog.depart` 的主动“出发”请求。
结合实际游戏机制来看，这意味着青蛙什么时候离开，很可能完全由服务器根据时间、背包和其他条件决定，而不是客户端按下某个按钮之后立即触发。

旅行过程中同样主要由服务器驱动。客户端会接收：`client.load_events`、`notify.new_event`并维护自己的旅行事件列表；处理完某个事件后，再通过 `client.confirm_event` 告诉服务器已经读取。

源码中还能看到一个明确的 `BackHome` 旅行事件类型，因此“青蛙回家”本身很可能也是服务器生成的一条时间事件。

现在青蛙正好处于外出状态。下一步准备切回官方协议抓取模式，在餐桌上放好食物之后长时间保持游戏运行，同时持续记录 `FROG` WebSocket 日志。因为无法准确预测青蛙什么时候回来，所以让日志持续写入电脑文件，直到观察到青蛙已经回家。

如果顺利，这一次长时间抓取应该能够获得整个旅行系统目前最关键的一批数据：外出期间的旅行事件、`notify.new_event`、可能产生的明信片或邮件，以及最重要的 `BackHome` 事件结构。

---
现在已经能够在完全本地的环境中收三叶草、购买商品、管理仓库、背包和餐桌，而且所有变化都会写入独立的本地存档并在重启后恢复。

接下来真正困难的部分，是还原原服务器中那些带有时间、随机性和状态机的逻辑，尤其是旅行、明信片和回家机制。