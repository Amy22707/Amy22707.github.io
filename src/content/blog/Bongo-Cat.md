---
title: Bongo Cat连点器脚本
description: 基于Windows的连续键盘输入
publishedAt: 2026-10-25
updatedAt: 2026-10-25
tags:
  - Python
  - 游戏
---
针对Steam上的[Bongo Cat](https://store.steampowered.com/app/3419430/Bongo_Cat/)，刷点击次数与成就。

![](https://ik.imagekit.io/Amyxue/Homepage_Amy/blog_qVEuSGOdz)

Mac用户只需下载一个连点器即可完成，Windows用户的表情成就也可以使用连点器完成。但由于大部分Windows连点器产生的模拟输入事件无法被游戏接收，也无法计入点击次数，因此使用脚本通过键盘输入累计计数。

最终功能：

- 使用F13–F24功能键，12个工作线程，并通过全局锁避免多个模拟键同时按下。
    
- 按住 Shift、Ctrl、Alt 时自动暂停，松开后延迟恢复。
    
- 微信、QQ、Steam 位于前台时自动暂停。
    
- 支持设置自动停止时间。
    
- 输出运行状态和暂停原因。
    
适用环境：Windows 10/11，Steam 版 Bongo Cat。

## 一、准备工作

### 1. 安装 Python

如果电脑还没有安装 Python，可以前往 [Python 官网](https://www.python.org/downloads/) 下载安装。

安装后打开终端，输入：

```
python --version
```

能够显示 Python 版本号即可。

### 2. 安装 pynput

本教程使用 `pynput` 模拟键盘输入。

在 PowerShell 或 CMD 中执行：

```
python -m pip install pynput
```

## 二、完整代码

```python
import time
import threading
import ctypes
from ctypes import wintypes
from pynput import keyboard

# ========== 配置 ==========

RATE = 5                 # 每个线程每秒目标发送次数
PRESS_TIME = 0.03        # 单次按键持续时间（秒）
MAX_SECONDS = 1800       # 自动停止时间，0表示不限时
MODIFIER_DELAY = 2.0     # 修饰键操作后的恢复延迟

KEYS = [
    getattr(keyboard.Key, f"f{i}")
    for i in range(13, 25)
]

BLOCKED_PROCESSES = {
    "wechat.exe",
    "weixin.exe",
    "qq.exe",
    "steam.exe",
    "steamwebhelper.exe",
}

# ========== 状态 ==========

running = threading.Event()
shutdown = threading.Event()
allowed = threading.Event()

lock = threading.RLock()
send_lock = threading.Lock()

pressed_hotkeys = set()
held_modifiers = set()

start_time = None
resume_after = 0.0
last_status = None

# ========== Windows API ==========

user32 = ctypes.WinDLL(
    "user32", use_last_error=True
)
kernel32 = ctypes.WinDLL(
    "kernel32", use_last_error=True
)

user32.GetForegroundWindow.restype = wintypes.HWND

user32.GetWindowThreadProcessId.argtypes = [
    wintypes.HWND,
    ctypes.POINTER(wintypes.DWORD)
]

kernel32.OpenProcess.argtypes = [
    wintypes.DWORD,
    wintypes.BOOL,
    wintypes.DWORD
]
kernel32.OpenProcess.restype = wintypes.HANDLE

kernel32.QueryFullProcessImageNameW.argtypes = [
    wintypes.HANDLE,
    wintypes.DWORD,
    wintypes.LPWSTR,
    ctypes.POINTER(wintypes.DWORD)
]
kernel32.QueryFullProcessImageNameW.restype = wintypes.BOOL

kernel32.CloseHandle.argtypes = [wintypes.HANDLE]
kernel32.CloseHandle.restype = wintypes.BOOL

user32.GetAsyncKeyState.argtypes = [ctypes.c_int]
user32.GetAsyncKeyState.restype = ctypes.c_short


def get_foreground_process():
    hwnd = user32.GetForegroundWindow()

    if not hwnd:
        return None

    pid = wintypes.DWORD()

    user32.GetWindowThreadProcessId(
        hwnd, ctypes.byref(pid)
    )

    if not pid.value:
        return None

    handle = kernel32.OpenProcess(
        0x1000, False, pid.value
    )

    if not handle:
        return None

    try:
        buf = ctypes.create_unicode_buffer(1024)
        size = wintypes.DWORD(len(buf))

        ok = kernel32.QueryFullProcessImageNameW(
            handle, 0, buf, ctypes.byref(size)
        )

        if not ok:
            return None

        return buf.value.rsplit(
            "\\", 1
        )[-1].lower()

    finally:
        kernel32.CloseHandle(handle)


# ========== 修饰键检测 ==========

MODIFIER_KEYS = {
    keyboard.Key.shift,
    keyboard.Key.shift_l,
    keyboard.Key.shift_r,
    keyboard.Key.ctrl,
    keyboard.Key.ctrl_l,
    keyboard.Key.ctrl_r,
    keyboard.Key.alt,
    keyboard.Key.alt_l,
    keyboard.Key.alt_r,
    keyboard.Key.alt_gr,
}


def physical_modifiers():
    result = []

    for vk, name in [
        (0x10, "Shift"),
        (0x11, "Ctrl"),
        (0x12, "Alt"),
    ]:
        if user32.GetAsyncKeyState(vk) & 0x8000:
            result.append(name)

    return result


def pause_for_modifier():
    global resume_after

    with lock:
        resume_after = max(
            resume_after,
            time.monotonic() + MODIFIER_DELAY
        )

    allowed.clear()


def modifier_active():
    with lock:
        listener_detected = bool(held_modifiers)

    physical = physical_modifiers()

    if listener_detected or physical:
        pause_for_modifier()
        return True

    return False


# ========== 状态管理 ==========

def get_status():
    if shutdown.is_set():
        return "退出"

    if not running.is_set():
        return "手动暂停"

    if modifier_active():
        return "修饰键按下，自动暂停"

    with lock:
        deadline = resume_after

    if time.monotonic() < deadline:
        return "修饰键冷却中，自动暂停"

    process = get_foreground_process()

    if process is None:
        return "前台窗口无法识别，自动暂停"

    if process in BLOCKED_PROCESSES:
        return f"{process} 在前台，自动暂停"

    return "运行中"


def print_status(status):
    global last_status

    if status == last_status:
        return

    last_status = status
    now = time.strftime("%H:%M:%S")

    if status == "运行中":
        print(f"[{now}] 连点器恢复")
    elif status == "退出":
        print(f"[{now}] 程序退出")
    else:
        print(f"[{now}] {status}")


# ========== 状态监控 ==========

def monitor():
    while not shutdown.is_set():
        with lock:
            start = start_time

        if (
            MAX_SECONDS > 0
            and running.is_set()
            and start is not None
            and time.monotonic() - start >= MAX_SECONDS
        ):
            running.clear()
            allowed.clear()
            print("达到时间上限，自动暂停")

        status = get_status()

        if status == "运行中":
            allowed.set()
        else:
            allowed.clear()

        print_status(status)
        shutdown.wait(0.01)


# ========== 工作线程 ==========

def worker(worker_id):
    kb = keyboard.Controller()
    key = KEYS[worker_id]

    interval = 1.0 / RATE
    offset = worker_id / (RATE * len(KEYS))

    next_press = 0.0
    active = False

    try:
        while not shutdown.is_set():
            if not allowed.is_set():
                active = False
                shutdown.wait(0.01)
                continue

            if not active:
                next_press = (
                    time.monotonic() + offset
                )
                active = True

            now = time.monotonic()

            if now < next_press:
                shutdown.wait(
                    min(next_press - now, 0.01)
                )
                continue

            # 全局发送锁
            # 同一时刻只模拟一个功能键
            with send_lock:
                if shutdown.is_set():
                    break

                if (
                    not allowed.is_set()
                    or modifier_active()
                ):
                    next_press = time.monotonic() + interval
                    continue

                with lock:
                    cooling = (
                        time.monotonic() < resume_after
                    )

                if cooling:
                    next_press = time.monotonic() + interval
                    continue

                try:
                    kb.press(key)

                    deadline = (
                        time.monotonic() + PRESS_TIME
                    )

                    while time.monotonic() < deadline:
                        if (
                            shutdown.is_set()
                            or not allowed.is_set()
                            or modifier_active()
                        ):
                            break

                        remaining = (
                            deadline - time.monotonic()
                        )

                        shutdown.wait(
                            min(max(0, remaining), 0.003)
                        )

                finally:
                    kb.release(key)

            next_press = max(
                next_press + interval,
                time.monotonic()
            )

    except Exception as e:
        print(f"工作线程异常：{e}")
        shutdown.set()

    finally:
        try:
            kb.release(key)
        except Exception:
            pass


# ========== 键盘监听 ==========

def on_press(key):
    global start_time

    if key in KEYS:
        return

    if key in MODIFIER_KEYS:
        with lock:
            held_modifiers.add(key)

        pause_for_modifier()
        return

    if key in (keyboard.Key.f8, keyboard.Key.esc):
        with lock:
            if key in pressed_hotkeys:
                return

            pressed_hotkeys.add(key)

    if key == keyboard.Key.f8:
        if running.is_set():
            running.clear()
            allowed.clear()
            print("手动暂停")
        else:
            with lock:
                start_time = time.monotonic()

            running.set()
            print("手动开始")

    elif key == keyboard.Key.esc:
        running.clear()
        allowed.clear()
        shutdown.set()
        return False


def on_release(key):
    if key in MODIFIER_KEYS:
        with lock:
            held_modifiers.discard(key)

        pause_for_modifier()

    if key in (keyboard.Key.f8, keyboard.Key.esc):
        with lock:
            pressed_hotkeys.discard(key)


# ========== 主程序 ==========

print("Bongo Cat F13-F24 连点器")
print(f"工作线程：{len(KEYS)}")
print(f"每线程目标频率：{RATE} 次/秒")
print(f"修饰键恢复延迟：{MODIFIER_DELAY} 秒")
print(f"自动停止：{MAX_SECONDS} 秒")
print("F8 开始/暂停 | ESC 或 Ctrl+C 退出")

threads = []

monitor_thread = threading.Thread(
    target=monitor,
    daemon=True
)
monitor_thread.start()
threads.append(monitor_thread)

for i in range(len(KEYS)):
    t = threading.Thread(
        target=worker,
        args=(i,),
        daemon=True
    )
    t.start()
    threads.append(t)

try:
    with keyboard.Listener(
        on_press=on_press,
        on_release=on_release
    ) as listener:
        while not shutdown.is_set():
            shutdown.wait(0.1)

except KeyboardInterrupt:
    print("Ctrl+C 退出")

finally:
    running.clear()
    allowed.clear()
    shutdown.set()

    for t in threads:
        t.join(timeout=2)

    kb = keyboard.Controller()

    for key in KEYS:
        try:
            kb.release(key)
        except Exception:
            pass

    print("程序已退出")
```

## 三、运行方法

打开 Steam 版 Bongo Cat，然后在脚本所在目录打开终端。

输入：

```
python bongo_cat.py
```

程序启动后不会立刻开始模拟输入，需要按 F8。

|操作|功能|
|---|---|
|F8|开始或手动暂停|
|ESC|退出程序|
|Ctrl+C|在运行脚本的终端中退出|
|按住 Shift、Ctrl、Alt|自动暂停|
|松开修饰键|冷却结束后自动恢复|
|微信、QQ、Steam 位于前台|自动暂停|
|切换到其他软件|无其他暂停条件时自动恢复|

程序会在控制台输出状态，例如：

```
Bongo Cat F13-F24 连点器
工作线程：12
每线程目标频率：5 次/秒
修饰键恢复延迟：2.0 秒
自动停止：1800 秒

手动开始
[14:30:01] 连点器恢复
[14:30:15] 修饰键按下，自动暂停
[14:30:17] 修饰键冷却中，自动暂停
[14:30:19] 连点器恢复
```

运行期间可以正常输入普通字母和数字，但模拟功能键仍可能影响某些软件的快捷键处理。

## 四、参数调整

主要需要修改代码开头的四个参数。

### 1. RATE：发送频率

```
RATE = 5
```

这个参数表示每个工作线程的目标频率。

|RATE|12 线程合计目标频率|
|---|---|
|2|24 次/秒|
|3|36 次/秒|
|5|60 次/秒|
|8|96 次/秒|
|10|120 次/秒|

注意：由于使用了全局发送锁，所有线程不能同时模拟按键。因此上表是目标频率，并非实际能够达到的速度。

在 `PRESS_TIME = 0.03` 时，单纯按键持续时间就将总吞吐量的理论上限限制在约 33 次/秒，实际通常还会更低。不建议通过无限提高 RATE 来加速，这样不一定增加有效计数，反而可能造成线程竞争。

### 2. PRESS_TIME：按键持续时间

```
PRESS_TIME = 0.03
```

单位为秒，`0.03` 即 30ms。这个参数影响每次模拟按键从按下到释放的时间。持续时间太短可能无法被 Bongo Cat 正常记录，太长则会限制发送频率。本机测试中，30ms 是能够正常计数的配置。

### 3. MAX_SECONDS：自动停止时间

```
MAX_SECONDS = 1800
```

常用设置：

|数值|效果|
|---|---|
|0|不自动停止|
|600|10 分钟|
|1800|30 分钟|
|3600|1 小时|
|7200|2 小时|

达到时间上限后，程序会自动暂停，需要再次按 F8 才会重新开始。计时从每次 F8 启动开始，临时自动暂停的时间也包含在内。

### 4. MODIFIER_DELAY：修饰键恢复延迟

```
MODIFIER_DELAY = 2.0
```

按住 Shift、Ctrl、Alt 时会暂停模拟按键，松开后再等待 2 秒恢复。如果觉得等待太长，可以减小到 `1.0`；如果键盘组合操作仍受到影响，也可以适当增大。需要说明，延长恢复时间只能减少后续冲突，不能保证第一次 Shift 按下就一定正常生效。

## 五、为什么使用 F13–F24？

最初参考[这一实现](https://blog.csdn.net/weixin_37641832/article/details/159124781)，使用的是数字和字母：

```
KEY_LIST = list(
    "0123456789abcdefghijklmnopqrstuvwxyz"
)
```

这种方案同时创建 36 个工作线程，能够快速产生大量键盘事件，但也会导致用户的其他输入受到影响。

F13–F24 是 Windows 支持的虚拟功能键，虽然普通键盘通常没有这些物理按键，但可以通过软件模拟。这些按键一般不会直接产生文本字符，因此更适合这个用途。

值得注意的是，不同的输入方式也会影响游戏的识别。测试中，使用 Windows `keybd_event` 模拟 F24 未能增加次数，而使用 `pynput` 模拟 F13 则可以成功计数。

## 六、使用风险与注意事项

### 1. 高并发可能导致系统异常

最初使用 36 线程高频模拟字母数字时，实际遇到过电脑黑屏死机。因此，不建议直接使用非常高的频率，也不要在无人看管时长时间运行。

### 2. 其他软件可能受到影响

在一次测试中，使用 F13 连点器期间，正在微信中与好友正常聊天，微信突然要求重新登录，并出现提示：「为了你的账号安全，请重新登录。」

因此，本脚本增加了微信、QQ 和 Steam 的前台检测：这些软件处于前台时会自动暂停模拟输入。如果出现异常登录提示、快捷键失效或其他问题，建议立即停止脚本。

### 3. Shift、Ctrl、Alt 可能仍然受到影响

程序提供了修饰键检测和冷却机制，但无法完全避免真实输入与模拟输入之间的竞争。

如果需要使用重要快捷键，或者正在编写代码、处理文件，建议通过 F8 手动暂停。

### 4. 部分前台窗口可能无法识别

Windows 对部分系统窗口或高权限程序的访问存在限制，例如任务管理器可能无法被普通权限的 Python 脚本正确识别。当前版本在无法识别前台窗口时会自动暂停，避免在未知窗口继续发送输入。

## 八、常见问题

**Q：按 F8 后，Bongo Cat 次数没有增加？**

首先检查脚本是否显示「连点器恢复」。如果显示自动暂停，需要检查是不是微信、QQ、Steam 位于前台，或存在尚未结束的修饰键冷却时间。不同模拟输入方式的效果也可能不同，并不能保证所有设备都能成功计数。

**Q：为什么控制台显示开始了，但次数增长很慢？**

当前方案通过全局发送锁串行发送按键，优先减少键盘冲突，因此不能达到极高的速度。游戏实际记录的次数也不一定等于脚本发送的次数。

**Q：可以继续提高 RATE 吗？**

可以修改，但不建议盲目提高。如果 `PRESS_TIME = 0.03` 保持不变，发送锁会成为主要的吞吐量限制。更高的 RATE 不一定提升实际有效计数。

**Q：为什么 Shift 还是需要按两次？**

可能是模拟键盘事件与真实修饰键发生重叠。程序会在检测到修饰键后暂停，但第一次按键可能已经受到影响。可以适当延长冷却时间，但这不是彻底解决方案。如果对正常键盘使用有较高要求，建议手动暂停后再操作。

**Q：如何彻底退出？**

按 ESC，或者在运行 Python 的终端中按 Ctrl+C。如果整个 Windows 系统已经没有响应，快捷键不一定能够及时生效。

**Q：可以增加其他需要自动暂停的软件吗？**

可以，在配置区修改：

```
BLOCKED_PROCESSES = {
    "wechat.exe",
    "weixin.exe",
    "qq.exe",
    "steam.exe",
    "steamwebhelper.exe",
    "discord.exe",
    "telegram.exe",
}
```

这些名称需要与 Windows 任务管理器中实际显示的进程名相对应。
