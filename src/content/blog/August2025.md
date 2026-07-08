---
title: 25fall做题(复健)记录 - August
description: 开学前做题记录
publishedAt: 2025-08-22
tags:
  - 算法
  - Python
---
# 2025.8.22
## [简单密码](http://cs101.openjudge.cn/pctbook/E02767/)
特意挑了AC率100%而且看起来就很简单的题目。结果因为不熟悉语法+括号匹配调了一会。好久没有见到这个单词了qwq
![image](https://img2024.cnblogs.com/blog/2669443/202508/2669443-20250822230352128-934587643.png)

* Reference
[Python 条件语句](https://www.runoob.com/python/python-if-statement.html)
[ASCII 表](https://www.runoob.com/w3cnote/ascii.html)
[VSCode运行python报错SyntaxError: invalid syntax](https://blog.csdn.net/weixin_44721355/article/details/137674442)
[python 代码如何批量注释和取消](https://blog.csdn.net/weixin_47542175/article/details/113969084)
[Python range() 函数用法](https://www.runoob.com/python/python-func-range.html)
[Python ASCII码与字符相互转换](https://www.runoob.com/python3/python3-ascii-character.html)
[Python2 与 Python3 print 不换行](https://www.runoob.com/w3cnote/python-print-without-newline.html)
[Python占位符%详解](https://zhuanlan.zhihu.com/p/670586796)

* 注意点
1.括号匹配
2.ord()与chr()函数
3.ASCII码：A65 a97
4.print()的end=

* 代码
```
a=input()
for i in range(len(a)):
    b=ord(a[i])
    if(b>=65 and b<=69):
        print(chr(b+21),end="")
    elif(b>=70 and b<=90):
        print(chr(b-5),end="")
    else:
        print(a[i],end="")
    # print("%d\n" %ord(a[i]))
```

（我疑似有点太蠢了）

---
# 2025.8.23
## [THE DRUNK JAILER](http://cs101.openjudge.cn/pctbook/E01218/)

* Reference
[分解质因数](https://oi-wiki.org/math/number-theory/pollard-rho/)

* 代码
```
from math import sqrt
def factor(n):
    ans=1
    for i in range(2,int(sqrt(n))+1):
        t=0
        if(n%i==0):
            while(n%i==0):
                t+=1
                n//=i
            ans=ans*(t+1)
    if n!=1:
        ans*=2
    return ans

a=int(input())
for i in range(a):
    b=int(input())
    ans=0
    for j in range(1,b+1):
        if factor(j)%2==1:
            ans+=1
    print(ans)
```
---
# 2025.8.25
## [整数的个数](http://cs101.openjudge.cn/pctbook/E02676/)

* 注意点
1.split()函数

* 代码
```
k=int(input())
ans1=0
ans5=0
ans10=0
t=input()
a=t.split()
for i in range(k):
    b=int(a[i])
    #print(b)
    if b==1:
        ans1+=1
    elif b==5:
        ans5+=1
    elif b==10:
        ans10+=1
print("%d\n%d\n%d"%(ans1,ans5,ans10))
```

## [大小写字母互换](http://cs101.openjudge.cn/pctbook/E02689/)
最喜欢的一集。

* Reference
[掌握这几个函数，轻松搞定Python大小写字母转换！](https://zhuanlan.zhihu.com/p/683378184)

* 代码
```
a=input()
print(a.swapcase())
```
---
# 2025.8.26
## [装箱问题](http://cs101.openjudge.cn/pctbook/M01017/)
刚刚发现题目分为easy,medium和tough三个level……
调了半天，最后红温了决定这一次提交还是WA就去睡觉，然后终于AC了……
![image](https://img2024.cnblogs.com/blog/2669443/202508/2669443-20250826234236287-1766660501.png)

* 注意点
1.不要对原始数据进行操作，特别是你后面还要用到它的时候
2.注意if嵌套或平行的位置

* 代码
```
a=input()
b=[]
while(a!="0 0 0 0 0 0"):
    b=a.split()
    for i in range(6):
        b[i]=int(b[i])
    ans=0
    ans=ans+b[5]+b[4]+b[3]
    temp=b[1]
    temp=temp-b[3]*5
    ans=ans+b[2]//4+1
    #print(ans)
    if(b[2]%4==1):
        temp-=5
    elif(b[2]%4==2):
         temp-=3
    elif(b[2]%4==3):
        temp-=1
    elif(b[2]%4==0):
        ans-=1
    if(temp>0):
        ans=ans+temp//9+1
        if(temp%9==0):
            ans-=1
    t=ans*36-b[1]*4-b[2]*9-b[3]*16-b[4]*25-b[5]*36
    #print(ans)
    if(t<b[0]):
        ans+=((b[0]-t)//36+1)
        if((b[0]-t)%36==0):
            ans-=1
    # for i in range(6):
    #     print(b[i])
    #print(t)
    print(ans)
    a=input()
```
---
# 2025.8.27
## [滑雪](http://cs101.openjudge.cn/pctbook/M01088/)
因为二维列表的定义调了一下午。蠢死了。
SHOI2002的题目。一道搜索/dp的黄题，之前还做过。气死我了。

* Reference
1.[题解 P1434 【[SHOI2002]滑雪】](https://www.luogu.com.cn/article/04298ntn)
2.[Python map() 函数](https://www.runoob.com/python/python-func-map.html)
3.[Python创建二维数组的正确姿势](https://zhuanlan.zhihu.com/p/88197389)

* 注意点
1.二维数组最好用生成器定义与初始化。
2.记忆化搜索

* 代码
```
def dfs(x,y):
    if(s[x][y]):
        return s[x][y]
    s[x][y]=1
    for i in range(4):
        nx=x+dx[i]
        ny=y+dy[i]
        if(0<=nx<r and 0<=ny<c and a[nx][ny]<a[x][y]):
            dfs(nx,ny)
            s[x][y]=max(s[x][y],s[nx][ny]+1)
            # print(x," ",y," ",nx," ",ny)
    return s[x][y]
dx=[0,0,1,-1]
dy=[1,-1,0,0]
r,c=map(int,input().split())
a=[[]*105]*105
s=[[0 for _ in range(105)]for _ in range(105)]
for i in range(r):
    a[i]=input().split()
# for i in range(r):
#     for j in range(c-1):
#         print(a[i][j],end=" ")
#     print(a[i][c-1],end="\n")
for i in range(r):
    for j in range(c):
        a[i][j]=int(a[i][j])
ans=1
for i in range(r):
    for j in range(c):
        dfs(i,j)
        ans=max(ans,s[i][j])
# for i in range(r):
#     for j in range(c-1):
#         print(dfs(i,j),end=" ")
#     print(dfs(i,c-1),end="\n")
print(ans)
```
## [棋盘问题](http://cs101.openjudge.cn/pctbook/M01321/)

* 注意点
1.dfs：检测标记，递归调用，最后标记要还原
2.对变量global,才能使其在不同函数中被修改
3.检验边界，记得return掉

* 代码
```
a=[[" " for _ in range(10)] for _ in range(10)]
n,k,ans=0,0,0
flag=[0]*10
def dfs(l,step):
    global ans
    if(step==k):
        ans+=1
        return
    if(l==n):
        return
    for i in range(l,n):
        for j in range(n):
            if(a[i][j]=='#' and flag[j]==0):
                flag[j]=1
                dfs(i+1,step+1)
                flag[j]=0
while(True):
    n,k=map(int,input().split())
    ans=0
    flag=[0]*10
    if(n==-1 and k==-1):
        break
    for i in range(n):
        a[i]=list(input())
    dfs(0,0)
    print(ans)
```
---
# 2025.8.28
## [Ants](http://cs101.openjudge.cn/pctbook/M01852/)
昨天晚上写了一半，今天在邱德拔听开学第一课，不能看书看手机睡觉，遂盯着前面的栏杆想象上面有蚂蚁在爬行坠落。然后就想出来了，很简单的小奥题。

![4df3f36eae7592a152276eb7fde0c5d5](https://img2024.cnblogs.com/blog/2669443/202508/2669443-20250828183557351-1975812006.jpg)

* 代码
```
t=int(input())
for i in range(t):
    m,n=map(int,input().split())
    minm=0
    maxm=0
    a=list(map(int,input().split()))
    #a.sort()
    for j in range(n):
        minm=max(minm,min(a[j],m-a[j]))
    maxm=max(max(a),m-min(a))
    print(minm,maxm)
```
## [判断闰年](http://cs101.openjudge.cn/pctbook/E02733/)

* 代码
```
a=int(input())
if(a%4!=0 or (a%100==0 and a%400!=0) or a%3200==0):
    print("N")
else:
    print("Y")
```
## [鸡兔同笼](http://cs101.openjudge.cn/pctbook/E02750/)

* 代码
```
a=int(input())
minm=a//4
if(a%4!=0):
    minm+=1
maxm=a//2
if(a%2==1):
    minm,maxm=0,0
print(minm,maxm)
```
## [Domino piling](https://codeforces.com/problemset/problem/50/A)
有点太简单了，甚至怀疑了一下

* 代码
```
m,n=map(int,input().split())
print(m*n//2)
```
---
# 2025.8.29
## [Drinks](https://codeforces.com/problemset/problem/200/B)
用一堆背景掩盖了小学数学题的事实 最喜欢的一集

 * 代码
```
n=int(input())
ans=0
a=list(map(int,input().split()))
for i in range(n):
    ans+=a[i]
ans=float(ans)
ans=ans/n
print(ans)
```

## [两数相加](https://leetcode.cn/problems/add-two-numbers/description/)
第一次用leetcode,写了半天发现是要实现一个class。
学了很多语法和链表知识。

* Reference
1.[最直白的写法](https://leetcode.cn/problems/add-two-numbers/solutions/253746/zui-zhi-bai-de-xie-fa-by-meng-zhi-hen-n-2/)
2.[Python:Optional和带默认值的参数](https://blog.csdn.net/qq_44683653/article/details/108990873)
3.[Python中的self详细解析](https://zhuanlan.zhihu.com/p/356325860)

* 注意点
1.ListNode:链表的节点
2.“这是链表的性质，只要知道头在哪里，头之后的节点多可以根据.next指针进行访问，因此，返回头结点的效力等价于返回整个链表的效力。”保存头节点后可直接返回整个链表
3.if/else

* 代码
```
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        carry=0
        head=ans=ListNode(None)
        while(l1 or l2 or carry):
            carry=carry+(l1.val if l1 else 0)+(l2.val if l2 else 0)
            ans.next=ListNode(carry%10)
            ans=ans.next
            carry//=10
            l1=l1.next if l1 else None
            l2=l2.next if l2 else None
        return head.next
```

## [LeetCode1_两数之和](https://leetcode.cn/problems/two-sum/description/)
Hash表
* Reference
1.[【动画】从两数之和中，我们可以学到什么？（Python/Java/C++/C/Go/JS/Rust）](https://leetcode.cn/problems/two-sum/solutions/2326193/dong-hua-cong-liang-shu-zhi-he-zhong-wo-0yvmj/)
2.[Python3 字典](https://www.runoob.com/python3/python3-dictionary.html)
3.[Python enumerate() 函数](https://www.runoob.com/python/python-func-enumerate.html)

* 代码
```
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # for i in range(len(nums)):
        #     for j in range(i+1,len(nums)):
        #         if(nums[i]+nums[j]==target):
        #             return [i,j]

        # Hash
        idx={}
        for i,x in enumerate(nums): #x=nums[i]
            if(target-x in idx):
                return[idx[target-x],i]
            idx[x]=i

# 力扣评测机对每个测试数据，都会重新创建一个 Solution 对象
print(Solution().twoSum([2,7,11,15],9))
```
## [Pell数列](http://cs101.openjudge.cn/pctbook/E02786/)
* 代码
```
n=int(input())
a=[0,1,2]
for i in range(3,1000005):
    a.append((2*a[i-1]+a[i-2])%32767)
for i in range(n):
    m=int(input())
    print(a[m]%32767)
```
## [Ride to School](http://cs101.openjudge.cn/pctbook/M01922/)
讲座上想的。一开始只想到把小于零的情况排除，甚至还想模拟，搞了类自定义排序，然后发现太复杂了。看到题解小脑萎缩了。
所以过程极其复杂的一般都有简单数学结论，think before you code.

* Reference
1.[python3 类排序 类比较](https://blog.csdn.net/wjh2622075127/article/details/92990783)
2.[Python中定义(声明)结构体](https://blog.csdn.net/qq_37435462/article/details/124097046)

* 代码
```
import math
# import functools
# class Rider:
#     def __init__(self):
#         self.speed=0
#         self.time=0
# def cmp(self,other):
#     if(self.time<other.time):
#         return -1
#     elif(self.time==other.time):
#         return 0
#     else:
#         return 1
while(True):
    n=int(input())
    #ta=[]
    ans=float("inf")
    if(n==0):
        break
    for i in range(n):
        a,b=map(int,input().split("	"))
        if(b<0):
            continue
        time=math.ceil(float(b)+4.5/a*3600)
        ans=min(time,ans)
    # for i in range(n):
    #     t=Rider()
    #     t.speed,t.time=map(int,input().split("	"))
    #     ta.append(t)
    # a=sorted(ta,key=functools.cmp_to_key(cmp))
    # for i in range(n):
    #     print(a[i].speed,a[i].time)
    # for i in range(n):
    #     if(a[i].time>=0):
    #         idx=i
    #         break
    # ans=a[idx].time
    # time_catch=[]
    # for i in range(idx+1,n)
    #     if(a[i].speed)
    print(ans)
```
## [反反复复](http://cs101.openjudge.cn/pctbook/M02039/)
 * 注意点
1.list()
2.余数为零的处理
* 代码
```
# import numpy as np
n=int(input())
a=list(input())
a.insert(0," ")
for i in range(1,n+1):
    for j in range(1,len(a)):
        if(j%(2*n)==i or j%(2*n)==(2*n+1-i if i!=1 else 0)):
            print(a[j],end="")
# 1,10,11,20,21,30,31,40
# 2,9,12,19,22,
# 3,8,13,
# 4,7
# 5,6
```
## [求一元二次方程的根](http://cs101.openjudge.cn/pctbook/M02707/)
细节挺多
![image](https://img2024.cnblogs.com/blog/2669443/202508/2669443-20250829214407044-1145025511.png)
* 代码
```
from math import sqrt
n=int(input())
for i in range(n):
    a,b,c=map(float,input().split())
    d=b*b-4.0*a*c
    if(d>0):
        ans1=(-b+sqrt(d))/(2.0*a)
        ans2=(-b-sqrt(d))/(2.0*a)
        if(ans1<ans2):
            ans1,ans2=ans2,ans1
        print("x1=%0.5f;x2=%0.5f" %(ans1,ans2))
    elif(d==0):
        ans=(-b)/(2.0*a)
        print("x1=x2=%0.5f" %ans)
    else:
        re=(-b)/(2.0*a)
        im=(sqrt(-d))/(2.0*a)
        if(re==0):
            re=-re
        if(im>0):
            print("x1=%0.5f+%0.5fi;x2=%0.5f-%0.5fi" %(re,im,re,im))
        elif(im<0):
            print("x1=%0.5f+%0.5fi;x2=%0.5f-%0.5fi" %(re,-im,re,-im))
```

## [集合加法](http://cs101.openjudge.cn/pctbook/E02792/)
一开始大意了直接干成O(n^2)…… 忘记count()了自罚一杯
* Reference
1.[Python List count()方法](https://www.runoob.com/python/att-list-count.html)

* 代码
```
n=int(input())
for i in range(n):
    ans=0
    s=int(input())
    a=int(input())
    c=list(map(int,input().split()))
    b=int(input())
    d=list(map(int,input().split()))
    for j in range(a):
        ans+=d.count(s-c[j])
    print(ans)
```
---
# 2025.8.30
## [剪绳子](http://cs101.openjudge.cn/pctbook/M18164/)
一开始胡了一个前缀和，然后假了。接下来更是没有意识到剪绳子就是拼绳子，看到huffman的提示才意识到。然后对着生疏已久的数据结构彷徨一会，最后还是打开了题解，发现还有heapq这个东西。所以说，人生苦短，我用python。
* Reference
1.[Python中heapq模块浅析](https://blog.csdn.net/chandelierds/article/details/91357784)
2.[用Python实现删除列表中的指定元素](https://zhuanlan.zhihu.com/p/682229851)

* 注意点
小根堆的建立，添加元素与删除元素

* 代码
```
# Huffman
# merge
# heap
import heapq
n=int(input())
a=list(map(int,input().split()))
heapq.heapify(a)
ans=0
# for i in range(1,len(a)):
#     t1=min(a)
#     a.remove(t1)
#     t2=min(a)
#     a.remove(t2)
#     a.append(t1+t2)
#     ans+=(t1+t2)
for i in range(n-1):
    x=heapq.heappop(a)
    y=heapq.heappop(a)
    heapq.heappush(a,x+y)
    ans+=(x+y)
print(ans)
```

## [Watermelon](https://codeforces.com/problemset/problem/4/A)
一开始看到如此水题太激动了直接胡上去了然后WA了。为我的莽撞自罚一杯。
奇偶性判断。记得特判n=2，此时没有两个偶数的拆分。
* 代码
```
n=int(input())
if(n%2==0 and n>=4):
    print("YES")
else:
    print("NO")
```

## [Hangover](http://cs101.openjudge.cn/pctbook/E01003/)
每日两题。是新搬上oj的，看到老师发了就赶去做了，结果还是没有成为第一个AC的。慢了一分钟，哼
* 代码
```
a=[0.0,0.5]
for i in range(2,300):
    a.append(a[i-1]+1/(i+1))
# print(a)
while(True):
    n=float(input())
    if(n==0):
        break
    for i in range(1,300):
        if(a[i]>=n):
            print("%d card(s)" %i)
            break
```

## [生日相同](http://cs101.openjudge.cn/pctbook/E02724/)
本来不想做easy了，看到有人WA了遂做。对于easy题来说小有难度。
* Reference
1.[Python之字典一个key对应多个value](https://blog.csdn.net/u012856866/article/details/132429336)
* 注意点
字典的setdefault()
* 代码
```
# class student:
#     def __init__(self):
#         self.number=0
#         self.month=0
#         self.date=0
n=int(input())
a=[]
idx={}
for i in range(1231):
    idx.setdefault(i,[])
for i in range(n):
    # t=student()
    # t.number,t.month,t.date=map(int,input().split())
    x,y,z=map(str,input().split())
    y=int(y)
    z=int(z)
    num=y*100+z
    idx[num].append(x)
# print(idx)
for i in range(1231):
    if(len(idx[i])>1):
        y=i//100
        z=i-y*100
        print(y,z,end="")
        for j in range(len(idx[i])-1):
            print(" %s" %idx[i][j],end="")
        print(" %s" %idx[i][len(idx[i])-1])
```
## [2050年成绩计算](http://cs101.openjudge.cn/pctbook/M18176/)
埃氏筛。注意把1排掉。
* Reference
[Eratosthenes筛法](https://zhuanlan.zhihu.com/p/151432852)
* 代码
```
# pylint: skip-file
from math import sqrt
m,n=map(int,input().split())
p=[True]*10001
def is_prime(x):
    for i in range(2,int(sqrt(x)+1)):
        if(x%i==0):
            return False
    return True

for i in range(2,101):
    if(is_prime(i)):
        for j in range(i*i,10001,i):
            p[j]=False
def check(x):
    t=int(sqrt(x))
    if(t*t!=x):
        return False
    if(not p[t]):
        return False
    return True  
for i in range(m):
    a=list(map(int,input().split()))
    ans=0
    for j in range(len(a)):
        if(check(a[j]) and a[j]!=1):
            ans+=a[j]
    if(ans==0):
        print(0)
    else:
        print("%0.2f" %(ans/len(a)))
```
---
# 2025.8.31
## [回文数字（Palindrome Number）](http://cs101.openjudge.cn/pctbook/E04067/)
第一次接触到try……except与EOF处理，记之。
* Reference
[Python 异常处理](https://www.runoob.com/python/python-exceptions.html)
* 代码
```
# 0 1 2 3 4 ->5,2
# 0 1 2 3 4 5 ->6,3
while(True):
    try:
        t=input()
        flag=1
        for i in range(len(t)//2):
            if(t[i]!=t[len(t)-i-1]):
                print("NO")
                flag=0
                break
        if(flag==1):
            print("YES")
    except EOFError:
        break
```

## [病人排队](http://cs101.openjudge.cn/pctbook/E07618/)
复习了一下自定义排序。
* 代码
```
import functools
class patient:
    def __init__(self):
        self.num=""
        self.age=0
n=int(input())
p1=[]
p60=[]
def cmp(self,other):
    if(self.age<other.age):
        return 1
    elif(self.age==other.age):
        return 0
    else:
        return -1
for i in range(n):
    t=patient()
    x,y=map(str,input().split())
    t.num=x
    t.age=int(y)
    if(t.age>=60):
        p60.append(t)
    else:
        p1.append(t)
p60_new=sorted(p60,key=functools.cmp_to_key(cmp))
for i in range(len(p60_new)):
    print(p60_new[i].num)
for i in range(len(p1)):
    print(p1[i].num)
```
## [Theatre Square](https://codeforces.com/problemset/problem/1/A)
在CF AC的第一道题。重温。
* 代码
```
n,m,a=map(int,input().split())
x=n//a
y=m//a
if(n%a!=0):
    x+=1
if(m%a!=0):
    y+=1
print(x*y)
```
## [Next Round](https://codeforces.com/problemset/problem/158/A)
上午军训结业典礼一小时速通四道今天和明天的每日两题，然后浪了一天。还是先救救迫在眉睫的英语分级考吧。
* 代码
```
n,k=map(int,input().split())
a=list(map(int,input().split()))
t=a[k-1]
ans=k
for i in range(n):
    if(a[i]<=0 and i<k):
        ans=i
        break
    if(a[i]==t and i>=k):
        ans+=1
print(ans)
```
# 2025.9.2
## [Checking order](http://cs101.openjudge.cn/pctbook/E02883/)
帮室友debug的。
* 代码
```
while(True):
    try:
        flag=1
        a=list(map(int,input().split()))
        for i in range(4):
            if(a[i]>a[i+1]):
                flag=0
        if(flag==1):
            print('Yes')
        else:
            print("No",end=" ")
            a.sort()
            for i in range(4):
                print(a[i],end=" ")
            print(a[4])
    except EOFError:
        break
```

* debug的代码
```
import sys
for line in sys.stdin:
    # processed_line=line.strip()
    lst=list(map(int,line.split()))
    Flag=True
    for i in range(4):
        if lst[i]>lst[i+1]:
            Flag=False
    if Flag:
        print("Yes")
    else:
        print("No",end=" ")
        lst=sorted(lst)
        for i in range(4):
            print(lst[i],end=" ")
        print(lst[4])
```
## [与7无关的数](http://cs101.openjudge.cn/pctbook/E02701/)
* 代码
```
def check(x):
    if(x%7==0):
        return True
    if(x//10==7 or x%10==7):
        return True
    return False
ans=0
n=int(input())
for i in range(1,n+1):
    if(not check(i)):
        ans+=i*i
print(ans)
```

## [矩阵交换行](http://cs101.openjudge.cn/pctbook/E02899/)
* Reference
[Python如何打印控制字间距](https://docs.pingcode.com/baike/794125)
* 代码
```
a=[]
for i in range(5):
    a.append(input())
m,n=map(int,input().split())
if(m<0 or m>4 or n<0 or n>4):
    print("error")
else:
    a[m],a[n]=a[n],a[m]
    for i in range(5):
        a[i]=list(a[i].split())
        for j in range(4):
            print("{:>4}".format(a[i][j]),end="")
        print("{:>4}".format(a[i][4]))
```
## [Petya and Strings](https://codeforces.com/problemset/problem/112/A)
选python就是为了此刻！
* 代码
```
a=input()
b=input()
a=a.lower()
b=b.lower()
if(a<b):
    print(-1)
elif(a==b):
    print(0)
else:
    print(1)
```

## [验证“歌德巴赫猜想”](http://cs101.openjudge.cn/pctbook/E03143/)
帮室友debug的一天。神奇ojTLE显示Waiting
* 代码
```
from math import sqrt
p=[1 for _ in range(2005)]
def is_prime(x):
    for i in range(2,int(sqrt(x))):
        if(x%i==0):
            p[x]=0
            return False
    return True
def check(x):
    for i in range(2,int(sqrt(x))):
        if(is_prime(i)):
           for j in range(i*i,x,i):
                p[j]=0
check(2001)
x=int(input())
if(x<6 or x%2!=0):
    print("Error!")
else:
    for i in range(2,x//2+1):
        if(p[i]==1 and p[x-i]==1):
            print("%d=%d+%d" %(x,i,x-i))
```
# 2025.9.3
## [求排列的逆序数](http://cs101.openjudge.cn/pctbook/T07622/)
归并排序可以顺便求逆序对。
* Reference
[题解 P1908 【逆序对】](https://www.luogu.com.cn/article/u78mgb6k)
* 代码
```
ans=0
def merge(l,r):
    global ans
    mid=(l+r)//2
    if(l==r):
        return
    else:
        merge(l,mid)
        merge(mid+1,r)
    i=l
    j=mid+1
    k=l
    while(i<=mid and j<=r):
        if(a[i]<=a[j]):
            b[k]=a[i]
            k+=1
            i+=1
        elif(a[i]>a[j]):
            ans+=(mid-i+1)
            b[k]=a[j]
            k+=1
            j+=1
    while(i<=mid):
        b[k]=a[i]
        k+=1
        i+=1
    while(j<=r):
        b[k]=a[j]
        k+=1
        j+=1
    for i in range(l,r+1):
        a[i]=b[i]
n=int(input())
a=list(map(int,input().split()))
b=[0 for _ in range(n+1)]
merge(0,n-1)
print(ans)
```
## [Expedition](http://cs101.openjudge.cn/pctbook/M02431/)
洛谷双倍经验绿题。贪心+优先队列。
* Reference
1.[python heapq模块自定义比较函数](https://blog.csdn.net/qq_23262411/article/details/104854417)
2.[Python判断空的多种方法](https://blog.csdn.net/airen3339/article/details/134890795)
3.[SP348 EXPEDI - Expedition 题解](https://www.luogu.com.cn/problem/solution/SP348)
* 代码
```
import heapq
import functools
class gas:
    def __init__(self):
        self.distance=0
        self.fuel=0
    def __lt__(self,other):
        return self.fuel>other.fuel
def cmp(self,other):
    if(self.distance<other.distance):
        return -1
    elif(self.distance==other.distance):
        return 0
    else:
        return 1
n=int(input())
a=[]
h=[]
heapq.heapify(h)
for i in range(n):
    t=gas()
    t.distance,t.fuel=map(int,input().split())
    a.append(t)
l,p=map(int,input().split())
dis=0
tank=p
ans=0
for i in range(n):
    a[i].distance=l-a[i].distance
a=sorted(a,key=functools.cmp_to_key(cmp))
idx=0
while(tank>0 and dis<l):
    dis+=tank
    tank=0
    if(dis>=l):
        break
    else:
        for i in range(idx,n):
            if(a[i].distance<=dis):
                heapq.heappush(h,a[i])
            elif(a[i].distance>dis):
                idx=i
                break
        if(len(h)==0):
            break
        else:
            x=heapq.heappop(h)
            tank+=x.fuel
            ans+=1
if(dis<l):
    print(-1)
else:
    print(ans)
```
## [细菌繁殖](http://cs101.openjudge.cn/pctbook/E02712/)
* 代码
```
n=int(input())
month=[0,31,28,31,30,31,30,31,31,30,31,30,31]
for i in range(n):
    a,b,num,c,d=map(int,input().split())
    day=0
    for j in range(1,c):
        day+=month[j]
    day+=d
    for j in range(1,a):
        day-=month[j]
    day-=b
    print(num*2**day)
```

## [Team](https://codeforces.com/problemset/problem/231/A)
* 代码
```
n=int(input())
ans=0
for i in range(n):
    a,b,c=map(int,input().split())
    s=a+b+c
    if(s>=2):
        ans+=1
print(ans)
```

## [拦截导弹](http://cs101.openjudge.cn/pctbook/M02945/)
LIS，但$O(n^{2})$.盯着题目神游了半天，最后突然发现k<=25.
* Reference
[题解 P1020 【[NOIP1999 普及组] 导弹拦截】](https://www.luogu.com.cn/article/yc19s69p)
* 代码
```
k=int(input())
a=list(map(int,input().split()))
dp=[1 for _ in range(30)]
for i in range(1,k):
    for j in range(0,i):
        if(a[i]<=a[j]):
            dp[i]=max(dp[i],dp[j]+1)
print(max(dp))
```
## [乌鸦坐飞机](http://cs101.openjudge.cn/pctbook/T18146/)
没有技巧，全是细节。太刁钻了，前面写了若干思路最后都假了，最终按照题解还是调了半天。不愧是Tough难度的操作题。
考虑空出的座位。**注意中间四个可以放两个加一个，同时两个来自一窝的可以拆开。[2/1][2/1]空两格放了三个2.**
* 代码
```
n,k=map(int,input().split())
a=list(map(int,input().split()))
flag=1
# t2=n*2
# t4=n
empty=0
rest=[0,0,0,0]
for i in range(k):
    rest[a[i]%4]+=1
empty=rest[1]+rest[3]
t=rest[1]+n*2-rest[2]
if(t<0):
    t=-t
    empty+=t//3*2
    if(t%3==1):
        empty+=2
    elif(t%3==2):
        empty+=4
if(sum(a)+empty<=n*8):
    print("YES")
else:
    print("NO")
```
## [回文素数](http://cs101.openjudge.cn/pctbook/M03247/)
![226fe81adb28b259131221ae98c12ce3](https://img2024.cnblogs.com/blog/2669443/202509/2669443-20250903175058812-709955930.png)
不超时的方法是先构造出回文数再判断。python的字符串处理就大放异彩了。回文数数量较少因此作此考虑。如果把回文数全筛一遍会超时。
* Reference
[Python中[-1]、[:-1]、[::-1]、[n::-1]、[:,:,0]、[…,0]、[…,::-1] 的理解](https://blog.csdn.net/weixin_44350337/article/details/116034510)
* 代码
```
from math import sqrt
# p=[1 for _ in range(100000005)]
# p[1]=0
def is_prime(x):
    if(x==0 or x==1):
        return False
    if(x in {2,3,5,7}):
        return True
    if(x%2==0):
        return False
    for i in range(3,int(sqrt(x))+1,2):
        if(x%i==0):
            #p[x]=0
            return False
    return True
# def check(x):
#     for i in range(2,int(sqrt(x)+1)):
#         if(is_prime(i)):
#             for j in range(i*i,x,i):
#                 p[j]=0
# def palindrome(x):
#     for i in range(0,len(x)//2):
#         if(x[i]!=x[len(x)-i-1]):
#             return False
#     return True
n=int(input())
a=[]
mid=(n+1)//2
for i in range(10**(mid-1),10**mid):
    t=str(i)
    if(n%2==0):
        res=int(t+t[::-1])
    else:
        res=int(t+t[-2::-1])
    if(is_prime(res)):
        a.append(res)
#check(10**(n+1))
print(len(a))
if(len(a)>0):
    print(" ".join(map(str,a)))
    # for i in range(len(a)-1):
    #     print(a[i],end=" ")
    # print(a[len(a)-1])
```
# 2025.9.4
## [食物链](http://cs101.openjudge.cn/pctbook/T01182/)
并查集复健。看到群里有人问并且老师答不上来遂做。一开始并查集板子T了，然后换成C++就过了。
是一道之前集训的时候想做但最终没做的题。终于补上了。三倍并查集。
* Reference
[P2024 [NOI2001] 食物链 题解](https://www.luogu.com.cn/problem/solution/P2024)
* 代码
```
n,k=map(int,input().split())
fa=[0 for _ in range(300005)] #1-n self;n+1-2n prey;2n+1-3n predator
siz=[1 for _ in range(300005)]
def find(x):
    if(x==fa[x]):
        return x
    else:
        fa[x]=find(fa[x])
        return fa[x]
def merge(x,y):
    fx=find(x)
    fy=find(y)
    if(fx==fy):
        return
    if(siz[fx]>siz[fy]):
        fa[fy]=fx
        siz[fx]+=siz[fy]
    else:
        fa[fx]=fy
        siz[fy]+=siz[fx]
for i in range(1,3*n+1):
    fa[i]=i
ans=0
for i in range(k):
    d,x,y=map(int,input().split())
    if(x>n or y>n):
        ans+=1
        continue
    if(d==1):
        if(find(x+n)==find(y) or find(x+2*n)==find(y)):
            ans+=1
            continue
        merge(x,y)
        merge(x+n,y+n)
        merge(x+2*n,y+2*n)
    elif(d==2):
        if(x==y):
            ans+=1
            continue
        if(find(x)==find(y) or find(x)==find(y+2*n)):
            ans+=1
            continue
        merge(x,y+n)
        merge(x+n,y+2*n)
        merge(x+2*n,y)
print(ans)
```
## [Boy or Girl](https://codeforces.com/problemset/problem/236/A)
题干笑死我了。太真实。
打了burte froce标签。最喜欢的一集。
* 代码
```
a=input()
ans=0
for i in range(97,123):
    if(a.count(chr(i))>0):
        ans+=1
if(ans%2==1):
    print("IGNORE HIM!")
else:
    print("CHAT WITH HER!")
```
## [最大上升子序列和](http://cs101.openjudge.cn/pctbook/M03532/)
一个半小时的心理讲座速通五道Medium。爽。
* 代码
```
n=int(input())
a=list(map(int,input().split()))
dp=[1 for _ in range(1005)]#以i结尾的LIS大小
for i in range(n):
    dp[i]=a[i]
for i in range(1,n):
    for j in range(i):
        if(a[j]<a[i]):
            dp[i]=max(dp[i],dp[j]+a[i])
print(max(dp))
```
## [最长上升子序列](http://cs101.openjudge.cn/pctbook/M02757/)
* 代码
```
n=int(input())
a=list(map(int,input().split()))
dp=[1 for _ in range(1005)]#以i结尾的LIS长度
for i in range(1,n):
    for j in range(i):
        if(a[j]<a[i]):
            dp[i]=max(dp[i],dp[j]+1)
print(max(dp))
```
## [分解因数](http://cs101.openjudge.cn/pctbook/M02749/)
dfs.
* 代码
```
n=int(input())
ans=0
def dfs(x,k):
    global ans
    if(x==1):
        ans+=1
        return
    for i in range(k,x+1):
        if(x%i!=0):
            continue
        else:
            dfs(int(x/i),i)
for i in range(n):
    a=int(input())
    ans=0
    dfs(a,2)
    print(ans)
```
## [进程检测](http://cs101.openjudge.cn/pctbook/M04100/)
贪心。
* Reference
[区间贪心问题小结（区间选点，区间覆盖，区间选取）](https://www.cnblogs.com/dchnzlh/p/10427309.html)
* 代码
```
import functools
class test:
    def __init__(self):
        self.start=0
        self.end=0
def cmp(self,other):
    if(self.end<other.end):
        return -1
    elif(self.end==other.end):
        return 0
    else:
        return 1
k=int(input())
for i in range(k):
    n=int(input())
    a=[]
    ans=0
    for j in range(n):
        t=test()
        t.start,t.end=map(int,input().split())
        a.append(t)
    a=sorted(a,key=functools.cmp_to_key(cmp))
    # for j in range(n):
    #     print(a[j].start,a[j].end)
    cur=0
    for j in range(n):
        if(cur<a[j].start):
            cur=a[j].end
            ans+=1
    print(ans)
```
## [宗教信仰](http://cs101.openjudge.cn/pctbook/M02524/)
多测清空！多测清空！多测清空！
此处应该播放《昨日清空》。
并查集。
* 代码
```
def find(x):
    if(fa[x]==x):
        return x
    else:
        fa[x]=find(fa[x])
        return fa[x]
def merge(x,y):
    fa[find(x)]=find(y)
case=0
while(True):
    n,m=map(int,input().split())
    if(n==0 and m==0):
        break
    case+=1
    fa=[0 for _ in range(50005)]
    a=[0 for _ in range(50005)]
    for i in range(1,n+1):
        fa[i]=i
    for i in range(m):
        x,y=map(int,input().split())
        merge(x,y)
    for i in range(1,n+1):
        a[find(i)]+=1
        # print(find(i),end=" ")
    ans=0
    for i in range(1,n+1):
        if(a[i]>0):
            ans+=1
    print("Case %d: %d" %(case,ans))
```
# 2025.9.5
## [Stones on the Table](https://codeforces.com/problemset/problem/266/A)
贪心。实验室安全讲座，旁边好奇老哥看着我写的。尴尬。
* 代码
```
n=int(input())
a=list(input())
idx=1
ans=0
while(idx<len(a)):
    if(a[idx]==a[idx-1]):
        a.remove(a[idx])
        ans+=1
    else:
        idx+=1
print(ans)
```
## [Sticks](http://cs101.openjudge.cn/pctbook/T01011/)
挺难的搜索+剪枝。
后面还需要再拿出来理解理解。
* 代码1
```
a=[]
vis=[0 for _ in range(100)]
def factor(x,idx,lst):
    for i in range(idx,x+1):
        if(x%i==0):
            lst.append(i)
def dfs(stick,length,l0):
    global n
    if(stick==0 and length==0):
        return True
    if(length==0):
        length=l0
    for i in range(n):
        if(vis[i]==0 and length>=a[i]):
            if(i!=0):
                if(vis[i-1]==0 and a[i-1]==a[i]):#前一根已在相同位置访问过，跳过
                    continue
            vis[i]=1
            if(dfs(stick-1,length-a[i],l0)):
                return True
            vis[i]=0
            if(length==a[i] or length==l0):#剩下的空间==使用的长度->最优解；第一次尝试，若无解则直接跳过
                break
    return False
while(True):
    n=int(input())
    if(n==0):
        break
    a=list(map(int,input().split()))
    s=sum(a)
    m=max(a)
    fac=[]
    factor(s,m,fac)
    a.sort()
    a=a[::-1]
    for i in fac:
        vis=[0 for _ in range(100)]
        if(dfs(n,0,i)):#棍子数，剩余长度,总长度
            print(i)
            break
```
* 代码2
```
a=[]
vis=[0 for _ in range(100)]
next=[0 for _ in range(100)]
#ok=0
def factor(x,idx,lst):
    for i in range(idx,x+1):
        if(x%i==0):
            lst.append(i)
def dfs(stick,length,l0,last):
    global n
    #print(stick,length,l0,last)
    if(stick==0 and length==0):
        #ok=1
        return True
    if(length==0):
        for i in range(n):
            if(vis[i]==0):
                break
        vis[i]=1
        if(dfs(stick-1,l0-a[i],l0,i)):
            return True
        vis[i]=0
        return False
        # if(ok==1):
        #     return True#6
    l=last
    r=n-1
    while(l<r):
        mid=(l+r)//2
        if(a[mid]<=length):
            r=mid
        else:
            l=mid+1
    for i in range(l,n):#4.二分查找长度递减
        if(vis[i]==0 and length>=a[i]):
            vis[i]=1
            if(dfs(stick-1,length-a[i],l0,i)):
                return True
            vis[i]=0
            # if(ok==1):
            #     return True
            if(length==a[i] or length==l0):#7.剩下的空间==使用的长度->最优解；第一次尝试，若无解则直接跳过
                break
            i=next[i]
    return False
while(True):
    n=int(input())
    if(n==0):
        break
    a=list(map(int,input().split()))
    s=sum(a)
    m=max(a)
    fac=[]
    factor(s,m,fac)
    a.sort()
    a=a[::-1]#1.从大到小
    next[n-1]=n-1
    for i in range(n-2,-1,-1):
        if(a[i]==a[i+1]):
            next[i]=next[i+1]#3
        else:
            next[i]=i
    for i in fac:
        # ok=0
        vis=[0 for _ in range(100)]
        if(dfs(n,i,i,0)):#棍子数，剩余长度,总长度,上一根木棍编号
            print(i)
            break#6
```
# 2025.9.6
## [文字排版](http://cs101.openjudge.cn/pctbook/E06374/)
我不理解。为什么这道题通过率是100%。疑似学C++学出工伤。
（其实就是不知道py的字符串操作。自罚一杯。）
* 注意点
1.for……else语句。特判输入只有一个单词。
2..rstrip()函数。
3..join()函数。
* 代码
```
n=int(input())
a=list(input().split())
# b=[-1]
# cnt=0
# word=0
# for i in range(len(a)):
#     cnt+=1
#     word+=1
#     if(a[i]==' ' and cnt>80):
#         b.append(i-word)
#         cnt=word
#         word=0
#     elif(a[i]==' ' and cnt<=80):
#         word=0
# for i in range(1,len(b)):
#     for j in range(b[i-1]+1,b[i]-1):
#         print(a[j],end="")
#     print(a[b[i]-1])
ans=[]
tmp=a[0]+' '
for i in range(1,len(a)):
    if(len(tmp)+len(a[i])>80):
        ans.append(tmp.rstrip())
        tmp=a[i]+' '
    else:
        tmp+=a[i]+' '
else:
    ans.append(tmp.rstrip())
print("\n".join(ans))
```
## [Beautiful Matrix](https://codeforces.com/problemset/problem/263/A)
今天精神不太好。总算爽了一次。
* 代码
```
a=[]
for i in range(5):
    a.append(list(map(int,input().split())))
for i in range(5):
    for j in range(5):
        if(a[i][j]==1):
            print(abs(2-i)+abs(2-j))
            break
```
## [Radar Installation](http://cs101.openjudge.cn/pctbook/M01328/)
一开始贪心贪错了。转化为区间点覆盖问题。
* 代码
```
import functools
from math import sqrt
class isle:
    def __init__(self):
        self.x=0
        self.y=0
class point:
    def __init__(self):
        self.left=0
        self.right=0
def cmp(self,other):
    if(self.right>other.right):
        return 1
    elif(self.right==other.right):
        return 0
    else:
        return -1
case=0
while(True):
    n,d=map(int,input().split())
    case+=1
    flag=1
    ans=[]
    a=[]
    p=[]
    cnt=0
    if(n==0 and d==0):
        break
    for i in range(n):
        t=isle()
        t.x,t.y=map(int,input().split())
        if(t.y>d):
            flag=0
        a.append(t)
        tp=point()
        if(flag==1):
            tp.left=a[i].x-sqrt(d*d-a[i].y*a[i].y)
            tp.right=a[i].x+sqrt(d*d-a[i].y*a[i].y)
            p.append(tp)
    p=sorted(p,key=functools.cmp_to_key(cmp))#从小到大
    if flag==0:
        print("Case %d: -1" %(case))
    elif(flag==1):
        cur=0
        for i in range(n):
            if(i==0):
                cnt+=1
                cur=p[0].right
            else:
                if(p[i].left>cur):
                    cnt+=1
                    cur=p[i].right
        print("Case %d: %d" %(case,cnt))
    input()
```
## [[NOIP 2002 普及组] 级数求和](https://www.luogu.com.cn/problem/P1035)
这就是我水群的代价。
* 代码
```
k=int(input())
n=1
s=1.0
while(s<=k):
    n+=1
    s+=1/n
print(n)
```

## [求和](http://cs101.openjudge.cn/pctbook/E02940/)
* 代码
```
a,n=map(int,input().split())
ans=0
for i in range(1,n+1):
    ans+=i*10**(n-i)
print(ans*a)
```
# 2025.9.7
开学前最后一天！计概开课之后开新的博客记录！
## [编码字符串](http://cs101.openjudge.cn/pctbook/E12556/)
* 代码
```
a=input().lower()
ans='('+a[0]+','
cnt=1
for i in range(1,len(a)):
    if(a[i]!=a[i-1]):
        ans+=str(cnt)+')'+'('+a[i]+','
        cnt=1
    else:
        cnt+=1
ans+=str(cnt)+')'
print(ans)
```
## [Hit the Lottery](https://codeforces.com/problemset/problem/996/A)
对的贪心也有板子题。
* 代码
```
a=int(input())
ans=0
ans+=a//100
a%=100
ans+=a//20
a%=20
ans+=a//10
a%=10
ans+=a//5
a%=5
ans+=a
print(ans)
```
## [最短的愉悦旋律长度](http://cs101.openjudge.cn/pctbook/T27103/)
神仙解法……真的神仙……神中神
神仙set……python还是太全面了……
![image](https://img2024.cnblogs.com/blog/2669443/202509/2669443-20250907173202288-2141268834.png)
* Reference
[Python3 集合](https://www.runoob.com/python3/python3-set.html)
* 代码
```
n,m=map(int,input().split())
a=list(map(int,input().split()))
cnt=1
s=set()
for i in range(n):
    s.add(a[i])
    if(len(s)==m):
        cnt+=1
        s.clear()
print(cnt)
```
# 2025.9.8
## [假币问题](http://cs101.openjudge.cn/pctbook/T02692/)
把24种情况枚举一遍/判断所有硬币里面最有可能是假币的/集合
集合简直是神仙做法
一开始WA了，盯着代码看了半天，最后发现是没写多测。被自己笑到了。
* Reference
[Python set() 函数](https://www.runoob.com/python/python-func-set.html)
* 代码
```
n=int(input())
a=["A","B","C","D","E","F","G","H","I","J","K","L"]
for i in range(n):
    heavy=set(a)
    light=set(a)
    for i in range(3):
        x,y,z=input().split()
        if(z=="even"):
            heavy-=set(x)
            heavy-=set(y)
            light-=set(x)
            light-=set(y)
        elif(z=="up"):
            heavy&=set(x)
            light&=set(y)
        elif(z=="down"):
            heavy&=set(y)
            light&=set(x)
    for i in a:
        if(i in heavy and i not in light):
            print("%s is the counterfeit coin and it is heavy." %i)
            break
        elif(i in light and i not in heavy):
            print("%s is the counterfeit coin and it is light." %i)
            break
```
## [提取实体](http://cs101.openjudge.cn/pctbook/E19949/)
* 代码
```
n=int(input())
ans=0
for i in range(n):
    idx=-2
    a=list(input().split())
    for j in range(len(a)):
        t=list(a[j])
        if(len(t)>=7):
            if(t[0]==t[1]==t[2]==t[-1]==t[-2]==t[-3]=='#'):
                if(j==idx+1):
                    idx=j
                else:
                    idx=j
                    ans+=1
print(ans)
```
## [Divisibility Problem](https://codeforces.com/problemset/problem/1328/A)
* 代码
```
n=int(input())
for i in range(n):
    a,b=map(int,input().split())
    if(a%b==0):
        print(0)
    else:
        print(b-a%b)
```
## [水淹七军](http://cs101.openjudge.cn/pctbook/M12029/)
一整节思修课都在调这道题。先是发现输入不对，再是发现因为dfs写错位置导致爆栈。反正看图。已经笑晕过去了。
要淹的地方不一定是dfs的终点。所以一开始的做法假了。
![b3de1b1b0f016b0900e015646d2bd349](https://img2024.cnblogs.com/blog/2669443/202509/2669443-20250908211506502-1039352984.jpg)
![28d3c8e069a9c0d97ef232e55095bc0a](https://img2024.cnblogs.com/blog/2669443/202509/2669443-20250908211516039-1204516792.jpg)
![277800f957a27795467dea8d2d90ef43](https://img2024.cnblogs.com/blog/2669443/202509/2669443-20250908211526057-491815208.png)
![f1df63e68cfeb23ab86e1319982e4af3](https://img2024.cnblogs.com/blog/2669443/202509/2669443-20250908211533893-1067989306.jpg)

* 代码
```
import sys
sys.setrecursionlimit(300000)
input=sys.stdin.read
def dfs(x,y,h,a,water,m,n):
    #global flag,m,n,i0,j0
    dx=[1,0,-1,0]
    dy=[0,-1,0,1]
    # if(x==i0 and y==j0):
    #     flag=0
    #     return
    for i in range(4):
        x0=x+dx[i]
        y0=y+dy[i]
        if(0<=x0<m and 0<=y0<n):
            if(a[x0][y0]<h):
                if(water[x0][y0]<h):
                    water[x][y]=h
                    dfs(x0,y0,h,a,water,m,n)

data=input().split()
idx=0
k=int(data[idx])
idx+=1
res=[]
for q in range(k):
    m,n=map(int,data[idx:idx+2])
    idx+=2
    #flag=1
    a=[]
    water=[[0 for _ in range(n)]for _ in range(m)]
    for i in range(m):
        a.append(list(map(int,data[idx:idx+n])))
        idx+=n
    i0,j0=map(int,data[idx:idx+2])
    idx+=2
    i0-=1
    j0-=1
    p=int(data[idx])
    idx+=1
    for i in range(p):
        x,y=map(int,data[idx:idx+2])
        idx+=2
        x-=1
        y-=1
        if(a[x][y]<=a[i0][j0]):
            continue
        dfs(x,y,a[x][y],a,water,m,n)
    #     if(flag==0):
    #         print("Yes")
    #         break
    # if(flag==1):
    #     print("No")
    if(water[i0][j0]>0):
        print("Yes")
    else:
        print("No")
#         res.append("Yes" if water[i0][j0]>0 else "No")
#     sys.stdout.write("\n".join(res)+"\n")

# if __name__=="__main__":
#     main()
```


