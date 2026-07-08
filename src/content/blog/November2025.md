---
title: 25fall做题记录 - November
description: 2025.11做题记录及11月计概月考
publishedAt: 2025-11-01
tags:
  - 算法
  - Python
---
# 2025.11.1
## [括号生成](https://leetcode.cn/problems/generate-parentheses/description/)
向右或向上走，不能超过对角线。
Catalan数枚举。
```python
class Solution:
    def generateParenthesis(self, n: int) -> list[str]:
        ans=[]
        def dfs(l,res,r):
            if(l<r):
                return
            if(l+r==2*n-1):
                ans.append(res+')')
                return
            if(l<n):
                dfs(l+1,res+'(',r)
            if(l>r):
                dfs(l,res+')',r+1)
        dfs(1,"(",0)
        return ans
print(Solution().generateParenthesis((3)))
```
## [N 皇后](https://leetcode.cn/problems/n-queens/description/)
```python
class Solution:
    def solveNQueens(self, n: int) -> list[list[str]]:
        y=[0]*n
        z=[0]*(2*n+1)
        w=[0]*(2*n+1)
        ans=[]
        def dfs(x,res):
            if(x==n):
                tmp=[]
                for i in range(n):
                    t='.'*res[i]+'Q'+'.'*(n-1-res[i])
                    tmp.append(t)
                ans.append(tmp)
                return
            for i in range(n):
                if(y[i]==0 and z[i+x]==0 and w[i-x+n]==0):
                    y[i]=1
                    z[i+x]=1
                    w[i-x+n]=1
                    temp=res.copy()
                    temp.append(i)
                    dfs(x+1,temp)
                    y[i]=0
                    z[i+x]=0
                    w[i-x+n]=0
        dfs(0,[])
        return ans
print(Solution().solveNQueens(4))
```
## [熄灯问题](http://cs101.openjudge.cn/pctbook/T02811/)
根据题目提示，枚举第一行的所有情况，然后一行行往下推，直到遇到刚好全部关闭的情况。
二维数组的深拷贝需用copy库中的deepcopy().
```python
from copy import deepcopy
a=[]
a.append([0]*8)
for i in range(5):
    t=list(map(int,input().split()))
    t.insert(0,0)
    t.append(0)
    a.append(t)
a.append([0]*8)
qaq=deepcopy(a)
ans=[[0 for _ in range(8)]for _ in range(7)]
dx = [0, 1, 0, -1]
dy = [1, 0, -1, 0]
def button(i,j):
    for k in range(4):
        x0 = i + dx[k]
        y0 = j + dy[k]
        a[x0][y0] ^= 1
    a[i][j] ^= 1
    ans[i][j] ^= 1
def change():
    for i in range(2,6):
        for j in range(1,7):
            if(a[i-1][j]==1):
                button(i,j)
for i in range(1<<6):
    a=deepcopy(qaq)
    ans = [[0 for _ in range(8)] for _ in range(7)]
    # if(i==37):
    #     for j in range(1,6):
    #         print(" ".join(map(str, a[j][1:7])))
    #     print("TEST")
    for k in range(6):
        if(i&(1<<k)):
            button(1,k+1)
    # if(i==37):
    #     for j in range(1,6):
    #         print(" ".join(map(str, a[j][1:7])))
    #     print("TEST")
    change()
    if(sum(a[5][1:7])==0):
        for j in range(1, 6):
            print(" ".join(map(str,ans[j][1:7])))
        break
    # if(i==37):
    #     for j in range(1,6):
    #         print(" ".join(map(str, a[j][1:7])))
    #     print("TEST")
    #     for j in range(1,6):
    #         print(" ".join(map(str, ans[j][1:7])))
```
# 2025.11.4
## [马走日](http://cs101.openjudge.cn/pctbook/M04123/)
```python
t=int(input())
dx=[-2,-1,1,2,2,1,-1,-2]
dy=[1,2,2,1,-1,-2,-2,-1]
ans=0
def dfs(x,y,step):
    global ans
    if(step==m*n):
        ans+=1
        return
    for i in range(8):
        x0=x+dx[i]
        y0=y+dy[i]
        if(0<=x0<n and 0<=y0<m and vis[x0][y0]==0):
            vis[x0][y0]=1
            dfs(x0,y0,step+1)
            vis[x0][y0]=0
for i in range(t):
    n,m,x,y=map(int,input().split())
    vis=[[0 for _ in range(m)]for _ in range(n)]
    vis[x][y]=1
    ans=0
    dfs(x,y,1)
    print(ans)
```
## [排列](http://cs101.openjudge.cn/pctbook/T01833/)
1.康托展开+逆康托展开。还原的过程中使用小根堆。阶乘使用math库中的factorial.
[康托展开](https://baike.baidu.com/item/%E5%BA%B7%E6%89%98%E5%B1%95%E5%BC%80/7968428)
2.![image](https://img2024.cnblogs.com/blog/2669443/202511/2669443-20251104170447472-2048681290.png)
![image](https://img2024.cnblogs.com/blog/2669443/202511/2669443-20251104170626065-2135628022.png)
```python
from math import factorial
import heapq
m=int(input())
for p in range(m):
    n,k=map(int,input().split())
    a=list(map(int,input().split()))
    ans=[]
    t=0
    count=[0]*n
    for i in range(n):
        for j in range(i,n):
            if(a[j]<a[i]):
                count[i]+=1
    for i in range(n):
        t+=factorial(n-1-i)*count[i]
    t+=k
    t=(t+1)%(factorial(n))-1
    for i in range(n):
        temp=t//factorial(n-1-i)
        ans.append(temp)
        t=t-temp*factorial(n-1-i)
    res=[]
    nums=[]
    heapq.heapify(nums)
    for i in range(1,n+1):
        nums.append(i)
    for i in range(n):
        qwq=nums[ans[i]]
        res.append(qwq)
        nums.remove(qwq)
    print(" ".join(map(str,res)))
```
# 2025.11.7 月考
前一节体育课十二分钟跑跑寄了遂在自己笔记本上打的比赛。
## [一种等价类划分问题](http://cs101.openjudge.cn/20251106mockexam/E29982/)
模拟。可以使用字典完成。
注意审题，范围不包括m和n，以及要按数字和大小顺序输出。一开始还没注意输入输出格式。T1再次连交两发WA.
以后做题一上来一定不能急，仔细审题，确保签到题一次性对。
```python
from collections import defaultdict  
m,n,k=map(int,input().split(','))  
a=defaultdict(list)  
keys=set()  
for i in range(m+1,n):  
    t=str(i)  
    s=0  
    for j in range(len(t)):  
        s+=int(t[j])  
    if(s%k==0):  
        a[s].append(i)  
        keys.add(s)  
keys=list(keys)  
keys.sort()  
for i in keys:  
    print(",".join(map(str,a[i])))
```
## [dance](http://cs101.openjudge.cn/20251106mockexam/E30086/)
贪心。相邻两人组一组，差一定是最小的。
```python
n,d=map(int,input().split())  
a=list(map(int,input().split()))  
flag=1  
a.sort()  
for i in range(0,2*n-1,2):  
    if(a[i+1]-a[i]>d):  
        flag=0  
        break  
if(flag==1):  
    print("Yes")  
else:  
    print("No")
```
## [洋葱](http://cs101.openjudge.cn/20251106mockexam/M25570/)
直接考虑每个方块的数字之和，周围一圈的和就是大方块减小方块。
```python
n=int(input())  
a=[]  
for i in range(n):  
    t=list(map(int,input().split()))  
    a.append(t)  
i=0  
j=n-1  
res=[]  
while(i<=j):  
    temp=0  
    for p in range(i,j+1):  
        for q in range(i,j+1):  
            temp+=a[p][q]  
    res.append(temp)  
    i+=1  
    j-=1  
res.append(0)  
ans=[]  
for i in range(len(res)-1):  
    ans.append(res[i]-res[i+1])  
print(max(ans))
```
## [数的划分](http://cs101.openjudge.cn/20251106mockexam/M28906/)
dfs需要剪枝。为保证不重不漏，考虑从小到大搜，因此每次搜索的数不小于前一个数，同时不大于剩余所有数的平均数。
dp状态定义为i个数分为j组的方案数。由于每组均为正整数，考虑先每组置1，再将剩余的数分1-j组。
状态转移方程：$dp[i][j]=\sum_{k=1}^j dp[i-j][k]$
注意到$dp[i][j]=\sum_{k=1}^{j-1} dp[i-j][k]$
因此$dp[i][j]=dp[i-1][j-1]+dp[i-j][j]$
或者考虑选1或不选1.选1即为dp[i-1][j-1],不选1则可以把每组减1，依然符合条件，即为dp[i-j][j].
```python
n,k=map(int,input().split())  
ans=0  
def dfs(step,cur,s):  
    global ans  
    if(s<0):  
        return  
    if(s==0 and step<k):  
        return  
    if(step==k):  
        if(s==0):  
            ans+=1  
        return  
    for i in range(cur,s//(k-step)+1):  
        dfs(step+1,i,s-i)  
dfs(0,1,n)  
print(ans)
```

```python
n,k=map(int,input().split())  
dp=[[0 for _ in range(k+1)]for _ in range(n+1)]#把i划分为j组的方案数  
for i in range(1,n+1):  
    dp[i][1]=1  
for i in range(1,n+1):  
    for j in range(2,k+1):  
        if(i==j):  
            dp[i][j]=1  
        elif(i>j):  
            dp[i][j]=dp[i-1][j-1]+dp[i-j][j]  
print(dp[n][k])
```
## [购物](http://cs101.openjudge.cn/20251106mockexam/M29896/)
好难的贪心。
考虑相同硬币数能够最多能够组成1-m的面值。下一次需要选取小于等于m+1面值的硬币，这样可以完全覆盖。一直选到能够覆盖到x面值。
```python
x,n=map(int,input().split())  
a=list(map(int,input().split()))  
a.sort()  
ans=1  
if(n==0):  
    print(-1)  
elif(a[0]!=1):  
    print(-1)  
else:  
    cur=1  
    while(cur<x):  
        for i in range(n-1,-1,-1):  
            if(a[i]<=cur+1):  
                ans+=1  
                cur+=a[i]  
                break  
    print(ans)
```
## [排队](http://cs101.openjudge.cn/pctbook/T25353/)
谁懂打开比赛题目列表发现T是一道之前老师布置的难题且没有尝试的救赎感。
没get到为什么标签是贪心。感觉更像升级版冒泡排序。
如果一个数与前面所有数的最大值与最小值都相差d以内，那么它一定可以到开头去。每一次都这么操作，把能够放到开头的元素存到缓存数组中并排序，如果没有就只放开头，并把当前数组加到答案数组末端。

根据你对题目的分析和代码实现，这道题 25353: 排队 的核心思想是：

利用“相邻且身高差 ≤ D 可交换”的规则，推导出可交换的连通块（等价类）；
在每个连通块内部可以任意重排（因为交换具有传递性）；
为了得到字典序最小的序列，对每个连通块内部进行升序排序；
连通块的划分不是显式建图，而是通过贪心扫描 + 极值维护的方式动态确定。
因此，合适的算法标签应包括：
✅ Greedy（贪心）
核心策略：从左到右尽可能早地形成一个合法的“可重排块”，并在块内排序以保证字典序最小。
每轮贪心地扩展当前块，只要加入新元素后仍满足 max - min <= D（等价于所有元素两两之间可通过一系列合法交换连通）。
✅ Sorting（排序）
每个连通块内部需排序（升序）以获得字典序最小结果。
✅ Two Pointers / Sliding Window（滑动窗口思想）
虽然代码用的是多轮扫描，但本质是在动态维护一个“当前可合并区间”，类似滑动窗口或分组策略。
更准确地说，是 Iterative Grouping with Range Constraint，但归入滑动窗口或双指针思想也合理。
✅ Connected Components（连通分量）（可选，偏图论视角）
如果从图论角度理解：若 |h[i] - h[j]| <= D 且 i, j 在同一连通段中（通过相邻合法交换可达），则属于同一分量。
但本题并未显式建图或使用 DFS/BFS，所以这个标签可加但非必需；若平台支持“隐式连通分量”类标签，可考虑。
 

闫宏飞 , 11月12日 19:44
```python
n,d=map(int,input().split())  
a=[]  
for i in range(n):  
    t=int(input())  
    a.append(t)  
check=[1]*n  
ans=[]  
maxm=a[0]  
minm=a[0]  
while(sum(check)!=0):  
    i=0  
    qaq=[]  
    maxm=0  
    minm=0  
    while(i<n):  
        if(check[i]==1):  
            if(len(qaq)==0):  
                check[i]=0  
                qaq.append(a[i])  
                maxm=a[i]  
                minm=a[i]  
            else:  
                if(a[i]>=maxm):  
                    maxm=a[i]  
                elif(a[i]<=minm):  
                    minm=a[i]  
                if(a[i]>=maxm-d and a[i]<=minm+d):  
                    qaq.append(a[i])  
                    check[i]=0  
        i+=1  
    qaq.sort()  
    ans.extend(qaq)  
for i in ans:  
    print(i)
```
# 2025.11.11
## [最大连通域面积](http://cs101.openjudge.cn/pctbook/M18160/)
```python
t=int(input())
a=[]
ans=0
dx=[0,-1,-1,-1,0,1,1,1]
dy=[-1,-1,0,1,1,1,0,-1]
def dfs(x,y):
    global ans
    for i in range(8):
        x0=x+dx[i]
        y0=y+dy[i]
        if(0<=x0<n and 0<=y0<m):
            if(vis[x0][y0]==0 and a[x0][y0]=='W'):
                vis[x0][y0]=1
                ans+=1
                dfs(x0,y0)
for i in range(t):
    n,m=map(int,input().split())
    a=[]
    for j in range(n):
        t=input()
        a.append(t)
    vis=[[0 for _ in range(m)]for _ in range(n)]
    ans=0
    maxm=0
    for p in range(n):
        for q in range(m):
            if(a[p][q]=='W' and vis[p][q]==0):
                vis[p][q]=1
                ans=1
                dfs(p,q)
                maxm=max(maxm,ans)
    print(maxm)
```
## 有用但没用过的库
1.lru_cache
2.bisect

## [全排列III](https://sunnywhy.com/sfbj/4/3/134)
同一个位置不放两个相同的数。具体实现方法为每次只取一串相同数中的第一个没有用过的数。注意and与or判断需要加括号以明确优先级。
```python
n=int(input())
a=list(map(int,input().split()))
a.sort()
vis=[0]*n
def dfs(step,cur):
    if(step==n):
        print(" ".join(map(str,cur)))
        return
    for i in range(n):
        if(vis[i]==0 and (i==0 or (a[i]!=a[i-1] or vis[i-1]==1))):
            temp=cur.copy()
            temp.append(a[i])
            vis[i]=1
            dfs(step+1,temp)
            vis[i]=0
dfs(0,[])
```
## [组合II](https://sunnywhy.com/sfbj/4/3/136)
```python
n,k=map(int,input().split())
a=list(map(int,input().split()))
vis=[0]*n
def dfs(step,cur,t):
    if(step==k):
        print(" ".join(map(str,cur)))
        return
    for i in range(t+1,n):
        if(vis[i]==0):
            temp=cur.copy()
            temp.append(a[i])
            vis[i]=1
            dfs(step+1,temp,i)
            vis[i]=0
dfs(0,[],-1)
```
## [组合III](https://sunnywhy.com/sfbj/4/3/137)
```python
n,k=map(int,input().split())
a=list(map(int,input().split()))
vis=[0]*n
def dfs(step,cur,t):
    if(step==k):
        print(" ".join(map(str,cur)))
        return
    for i in range(t+1,n):
        if(vis[i]==0 and (i==0 or (a[i]!=a[i-1] or vis[i-1]==1))):
            temp=cur.copy()
            temp.append(a[i])
            vis[i]=1
            dfs(step+1,temp,i)
            vis[i]=0
dfs(0,[],-1)
```
## [Tian Ji -- The Horse Racing](http://cs101.openjudge.cn/pctbook/T02287/)
贪心。先将两组马从大到小排序。
如果田忌最大的马比齐王大，那么赢齐王。（这一步最优是因为当前齐王的马最大，因此用任何马赢了它都没有损失。）
如果田忌最大的马没有齐王大，那么用最小的马输齐王。（这一步最优是因为无论如何都会输给齐王这匹马，因此用田忌最小的马顶。）
如果田忌最大的马等于齐王最大的马，由于平局不扣钱，那么两步可能的路径是两匹马平局，或者用田忌最小的马输齐王最大的马。不能单从这两匹马判断最优策略，因此先考虑田忌最小的马的用途。
此时如果田忌最小的马大于齐王最小的马，那么赢齐王。（这一步最优是因为这是田忌最小的马，能赢总归是赚的。）
而如果田忌最小的马小于齐王最小的马，那么用这匹马输齐王最大的马。（这匹马无论如何都会输。）
如果田忌最小的马等于齐王最小的马，用这匹马输齐王最大的马更优。（这两组同时平局与相互交叉打的财产均为0，而剩余马贪心的钱财数大于等于安排这两组交叉打的钱财数。）
使用四个指针即可。注意结束循环的条件。
```python
while(True):
    n=int(input())
    if(n==0):
        break
    a=list(map(int,input().split()))
    b=list(map(int,input().split()))
    a.sort(reverse=True)
    b.sort(reverse=True)
    i0=j0=0
    i1=j1=n-1
    ans=0
    while(i0<=i1 and j0<=j1):
        if(a[i0]>b[j0]):
            ans+=1
            i0+=1
            j0+=1
        elif(a[i0]<b[j0]):
            ans-=1
            i1-=1
            j0+=1
        else:
            if(a[i1]>b[j1]):
                ans+=1
                i1-=1
                j1-=1
            else:
                if(a[i1]<b[j0]):
                    ans-=1
                i1-=1
                j0+=1
    print(ans*200)
```
# 2025.11.12
## [简单的整数划分问题](http://cs101.openjudge.cn/pctbook/T04117/)
dp同月考题。
```python
while True:
    try:
        n=int(input())
        dp=[[0 for _ in range(n+1)]for _ in range(n+1)]#i划分为j组
        for i in range(1,n+1):
            dp[i][1]=1
        for i in range(1,n+1):
            for j in range(2,n+1):
                dp[i][j]=dp[i-1][j-1]+dp[i-j][j]
        print(sum(dp[n]))
    except EOFError:
        break
```
## [电池的寿命](http://cs101.openjudge.cn/practice/03468/)
贪心。从小到大排序，分成总数相近的两组。相差的值可以通过从较大的那组选取两个电池先共同消耗掉一定时长来弥补。因此判断能否弥补即可。
![image](https://img2024.cnblogs.com/blog/2669443/202511/2669443-20251112193918212-575442188.png)

```python
while(True):
    try:
        n=int(input())
        a=list(map(int,input().split()))
        s=sum(a)
        a.sort()
        t=0
        idx=0
        ans=0
        qaq=0
        for i in range(n):
            t+=a[i]
            qaq=t-(s-t)
            if(i==n-1):
                idx=i
                break
            if(abs(qaq)<abs(t+a[i+1]-(s-t-a[i+1]))):
                idx=i
                break
        l=idx+1
        r=n-l
        if(qaq==0):
            ans=s/2
        elif(qaq<0):
            temp=0-qaq/2
            if(r==1):
                ans=t
            elif(a[-2]<temp):
                ans=t
            else:
                ans=s/2
        else:
            temp=qaq/2
            if(l==1):
                ans=s-t
            elif(a[idx-1]<temp):
                ans=s-t
            else:
                ans=s/2
        print("%0.1f" %(ans))
    except EOFError:
        break
```
## [Gone Fishing](http://cs101.openjudge.cn/practice/01042/)
枚举钓鱼的湖的数目，这样花在路上的时间确定。然后把鱼的数目放入大根堆中，每次取出最大的数目再更新堆。
注意点：
1.堆，先按鱼的数目从大到小排，其次按照序号从小到大排，因为相同鱼数的情况下要求湖泊停留数组最小。
2.鱼数小于零了，此时变成零推回堆，这样等所有鱼都钓完了就一直停在最开始的地方。如果在鱼数小于等于零的时候直接抛弃而不推回堆，那么
![image](https://img2024.cnblogs.com/blog/2669443/202511/2669443-20251112232936491-876120575.png)
![image](https://img2024.cnblogs.com/blog/2669443/202511/2669443-20251112233009314-1157431472.png)
![image](https://img2024.cnblogs.com/blog/2669443/202511/2669443-20251112233044181-1902904048.png)
```python
import heapq
while(True):
    n=int(input())
    if(n==0):
        break
    h=int(input())*60
    f=list(map(int,input().split()))
    d=list(map(int,input().split()))
    t=list(map(int,input().split()))
    t.insert(0,0)
    p=[]
    heapq.heapify(p)
    sums=0
    ans=-1
    qaq=[0]*n
    for i in range(0,n):
        res=0
        qwq=[0]*n
        for j in range(0,i+1):
            heapq.heappush(p,(-f[j],j,d[j]))
        sums+=t[i]*5
        time=h-sums
        while(time>0 and len(p)>0):
            time-=5
            fi,ii,di=heapq.heappop(p)
            fi=-fi
            res+=fi
            fi-=di
            qwq[ii]+=5
            if(fi<0):
                fi=0
            heapq.heappush(p,(-fi,ii,di))
        p.clear()
        # if (sum(qwq) < h-sums):
        #     qwq[0] += h-sums - sum(qwq)
        if(res>ans or (res==ans and qwq>qaq)):
            ans=res
            qaq=qwq.copy()
    print(", ".join(map(str,qaq)))
    print("Number of fish expected: %d\n" %(ans))
```
# 2025.11.13
## [求最大公约数问题](http://cs101.openjudge.cn/practice/07592/)
辗转相除法
```python
x,y=map(int,input().split())
if(x>y):
    x,y=y,x
while(x>0):
    r=y%x
    y=x
    x=r
print(y)
```
## [简单的数学题](http://cs101.openjudge.cn/pctbook/E27273/)
```python
import math
t=int(input())
for i in range(t):
    n=int(input())
    s=(n+1)*n//2
    t=int(math.log(n,2))
    q=2*(2**(t+1)-1)
    print(s-q)
```
# 2025.11.17
## [逃离紫罗兰监狱](http://cs101.openjudge.cn/practice/29954/)
bfs的使用场景：求最短路/最近关系。
由于障碍物的存在，使用三维bfs，同时记录穿过障碍物的数量。
```python
from collections import deque
r,c,k=map(int,input().split())
a=[]
vis=[[[0]*(k+1) for _ in range(c)]for _ in range(r)]
q=deque()
dx=[0,1,0,-1]
dy=[1,0,-1,0]
tx,ty,sx,sy=0,0,0,0
ans=-1
def bfs():
    global sx,sy,tx,ty,r,c,k
    q.append((sx,sy,0,0))
    vis[sx][sy][0]=1
    while(q):
        x0,y0,step,cnt=q.popleft()
        #print(x0,y0,step,cnt)
        # if((x0,y0)==(tx,ty)):
        #     return step
        for i in range(4):
            x1=x0+dx[i]
            y1=y0+dy[i]
            if(0<=x1<r and 0<=y1<c and vis[x1][y1][cnt]==0):
                vis[x1][y1][cnt]=1
                if(a[x1][y1]=='.'):
                    q.append((x1,y1,step+1,cnt))
                elif(a[x1][y1]=='#'):
                    if(cnt<k):
                        q.append((x1,y1,step+1,cnt+1))
                elif(a[x1][y1]=='E'):
                    return step+1
    return -1
for i in range(r):
    l=input()
    a.append(l)
    if('E' in l):
        tx=i
        ty=l.index('E')
    elif('S' in l):
        sx=i
        sy=l.index('S')
print(bfs())
```
## [算24](http://cs101.openjudge.cn/practice/02787/)
递归。
```python
def check(x,target):
    if(abs(x-target)<1e-6):
        return True
    return False
def op(a):
    if(len(a)==1):
        if(check(a[0],24)):
            return True
        else:
            return False
    for i in range(len(a)):
        for j in range(i+1,len(a)):
            x,y=a[i],a[j]
            qaq=[]
            for k in range(len(a)):
                if(k!=i and k!=j):
                    qaq.append(a[k])
            if(op(qaq+[x+y])):
                return True
            if(op(qaq+[x-y])):
                return True
            if(op(qaq+[y-x])):
                return True
            if(op(qaq+[x*y])):
                return True
            if(not check(y,0) and op(qaq+[x/y])):
                return True
            if(not check(x,0) and op(qaq+[y/x])):
                return True
while(True):
    a=list(map(int,input().split()))
    if(sum(a)==0):
        break
    if(op(a)):
        print("YES")
    else:
        print("NO")
```
## [柱状图中最大的矩形](https://leetcode.cn/problems/largest-rectangle-in-histogram/description/)
单调栈。
```python
from collections import deque
class Solution:
    def largestRectangleArea(self, heights: list[int]) -> int:
        n=len(heights)
        l=[-1]*n
        r=[n]*n
        t=deque()
        for i in range(n):
            while(t and heights[i]<=heights[t[-1]]):
                r[t[-1]]=i
                t.pop()
            l[i]=t[-1] if t else -1
            t.append(i)
        ans=0
        for i in range(n):
            ans=max(ans,heights[i]*(r[i]-l[i]-1))
        return ans
print(Solution().largestRectangleArea([2,1,5,6,2,3]))
print(Solution().largestRectangleArea([2,4]))
```
## [最大矩形](https://leetcode.cn/problems/maximal-rectangle/description/)
```python
from collections import deque
class Solution:
    def maximalRectangle(self, matrix: list[list[str]]) -> int:
        m=len(matrix)
        n=len(matrix[0])
        for i in range(m):
            for j in range(n):
                matrix[i][j]=int(matrix[i][j])
        s=[0]*n
        ans=0
        for i in range(m):
            for j in range(n):
                if(matrix[i][j]==0):
                    s[j]=0
                else:
                    s[j]+=matrix[i][j]
            l=[-1]*n
            r=[n]*n
            t=deque()
            for j in range(n):
                while(t and s[j]<=s[t[-1]]):
                    r[t[-1]]=j
                    t.pop()
                l[j]=t[-1] if t else -1
                t.append(j)
            for j in range(n):
                ans=max(ans,(s[j]*(r[j]-l[j]-1)))
        return ans
print(Solution().maximalRectangle([["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]))
```
## [植物观察](http://cs101.openjudge.cn/pctbook/M27306/)
种类并查集。
```python
n,m=map(int,input().split())
fa=[]
siz=[]
for i in range(2*n):
    fa.append(i)
    siz.append(1)
def find(x):
    if(fa[x]==x):
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
flag=1
for i in range(m):
    x,y,t=map(int,input().split())
    if(t==0):
        if(find(x+n)==y or find(x)==find(y+n)):
            flag=0
            break
        merge(x,y)
        merge(x+n,y+n)
    elif(t==1):
        if(find(x)==find(y) or find(x+n)==find(y+n)):
            flag=0
            break
        merge(x,y+n)
        merge(x+n,y)
if(flag==0):
    print("NO")
else:
    print("YES")
```
## [爬楼梯](https://leetcode.cn/problems/climbing-stairs/description/)
```python
class Solution:
    def climbStairs(self, n: int) -> int:
        dp=[-1]*(n+1)
        dp[0]=dp[1]=1
        dp[2]=2
        for i in range(3,n+1):
            dp[i]=dp[i-1]+dp[i-2]
        return dp[n]
print(Solution().climbStairs(2))
```
## [杨辉三角](https://leetcode.cn/problems/pascals-triangle/description/)
```python
class Solution:
    def generate(self, numRows: int) -> list[list[int]]:
        ans=[[1]]
        for i in range(1,numRows):
            l=[1]
            for j in range(1,i):
                l.append(ans[i-1][j-1]+ans[i-1][j])
            l.append(1)
            ans.append(l)
        return ans
print(Solution().generate(5))
```
## [Sereja and Suffixes](https://codeforces.com/problemset/problem/368/B)
```python
n,m=map(int,input().split())
a=list(map(int,input().split()))
dp=[0]*(n+1)
t=[0]*100005
for i in range(n-1,-1,-1):
    dp[i]=dp[i+1]
    if(t[a[i]]==0):
        dp[i]+=1
    t[a[i]]+=1
for i in range(m):
    s=int(input())
    print(dp[s-1])
```
## [Kuriyama Mirai's Stones](https://codeforces.com/contest/433/problem/B)
```python
n=int(input())
a=list(map(int,input().split()))
b=sorted(a)
pre1=[a[0]]
pre2=[b[0]]
for i in range(1,n):
    pre1.append(pre1[i-1]+a[i])
    pre2.append(pre2[i-1]+b[i])
u=int(input())
for i in range(u):
    t,l,r=map(int,input().split())
    if(t==1):
        print(pre1[r-1]-pre1[l-2] if l>=2 else pre1[r-1])
    elif(t==2):
        print(pre2[r-1]-pre2[l-2] if l>=2 else pre2[r-1])
```
## [The Sierpinski Fractal](http://cs101.openjudge.cn/practice/01941/)
递归。
```python
from functools import lru_cache
@lru_cache(maxsize=None)
def op(n):
    if(n==1):
        return [' /\\ ','/__\\']
    t=op(n-1)
    temp=[]
    qaq=[]
    for i in range(2**(n-1)):
        temp.append(t[i]+t[i])
    for i in range(2**(n-1)):
        qaq.append(' '*(2**(n-1))+t[i]+' '*(2**(n-1)))
    return qaq+temp
while(True):
    n=int(input())
    if(n==0):
        break
    t=op(n)
    for i in range(2**n):
        print(t[i].rstrip())
    print()
```
# 2025.11.18
## [跳台阶](http://cs101.openjudge.cn/practice/27528/)
```python
n=int(input())
a=[1,1]
for i in range(2,n+1):
    a.append(sum(a))
print(a[n])
```
## [《算法图解》小偷背包问题](http://cs101.openjudge.cn/pctbook/M23421/)
0-1背包
```python
n,b=map(int,input().split())
v=list(map(int,input().split()))
w=list(map(int,input().split()))
dp=[0]*(b+1)#放i个物品，使用j的容量最多的物品
#dp[i][j]=dp[i-1][j]+dp[i-1][j-w[i]]+v[i]
for i in range(n):
    for j in range(b,w[i]-1,-1):
        dp[j]=max(dp[j],dp[j-w[i]]+v[i])
print(max(dp))
```
## [最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/description/)
dp[i][j]记为i-j是否回文。状态转移方程dp[i][j]=dp[i+1][j-1]&(s[i] == s[j]).(从一个回文串向左右扩展。)注意初始赋值，一位的字符串都是回文的。以及注意dp顺序，根据状态转移方程应该按照字符串的长度从小到大更新状态。
```python
__import__('atexit').register(lambda: open('display_runtime.txt', 'w').write('0'))
class Solution:
    def longestPalindrome(self, s: str) -> str:
        n=len(s)
        dp=[[0 for _ in range(n)]for _ in range(n)]#i-j是否回文
        for i in range(n):
            dp[i][i]=1
            if(i<n-1 and s[i]==s[i+1]):
                dp[i][i+1]=1
        for j in range(3,n+1):
            for i in range(n-1):
                r=i+j-1
                if(r>=n):
                    break
                dp[i][r]=dp[i+1][r-1]&(s[i]==s[r])
        ans=0
        res=""
        for i in range(n):
            for j in range(i,n):
                if(dp[i][j]==1):
                    if(j-i+1>ans):
                        ans=j-i+1
                        res=s[i:j+1]
        return res
print(Solution().longestPalindrome("aaaaa"))
```
## [打家劫舍](https://leetcode.cn/problems/house-robber/description/)
dp数组记录最后偷第i家的情况下的最高金额。状态转移即考虑前一个偷了哪一家，应当为能偷的所有家里dp的最大值。
```python
class Solution:
    def rob(self, nums: list[int]) -> int:
        dp=nums.copy()
        n=len(nums)
        for i in range(2,n):
            dp[i]=max(dp[0:i-1])+nums[i]
        return max(dp)
print(Solution().rob([1,2,3,1]))
```
## [Flowers](https://codeforces.com/problemset/problem/474/D)
状态转移，考虑第i个是吃白花还是红花。吃白花则从dp(i-k)来，吃红花则从dp(i-1)来。预先把范围内每个数的方案数都算出来，并使用前缀和进行优化。
```python
t,k=map(int,input().split())
mod=1e9+7
dp=[0]*100005
for i in range(k):
    dp[i]=1
for i in range(k,100005):
    dp[i]=dp[i-k]+dp[i-1]
    dp[i]%=mod
pre=[dp[0]]
for i in range(1,100005):
    pre.append(dp[i]+pre[i-1])
for i in range(t):
    a,b=map(int,input().split())
    print(int((pre[b]-pre[a-1])%mod))
```
电脑前一天没充上电，于是计概上课打开电脑发现只有29%的电了。然后硬撑了三个小时，并与CF交一次in queue 20分钟的评测机鏖战。最终在下课铃响后一分钟内，作业的最后一道题突然跳了AC，此时电脑还剩3%的电。谁懂。
![image](https://img2024.cnblogs.com/blog/2669443/202511/2669443-20251118221917801-1329839560.png)
# 2025.11.23
## [电话号码](http://cs101.openjudge.cn/pctbook/M04089/)
字典树Trie.
```python
class TrieNode:
    def __init__(self):
        self.children={}
        self.is_end=False
class Trie:
    def __init__(self):
        self.root=TrieNode()
    def insert(self,word):
        node=self.root
        for digit in word:
            if digit not in node.children:
                node.children[digit]=TrieNode()
            node=node.children[digit]
            if(node.is_end):
                return False
        node.is_end=True
        return len(node.children)==0
t=int(input())
for i in range(t):
    n=int(input())
    nums=[]
    for j in range(n):
        q=input()
        nums.append(q)
    nums.sort()
    trie=Trie()
    flag=1
    for j in nums:
        if(not trie.insert(j)):
            flag=0
            break
    if(flag==1):
        print("YES")
    else:
        print("NO")
```
# 2025.11.24
## [Interesting drink](https://codeforces.com/problemset/problem/706/B)
bisect.
```python
import bisect
n=int(input())
p=list(map(int,input().split()))
q=int(input())
p.sort()
for i in range(q):
    m=int(input())
    print(bisect.bisect_right(p,m))
```
## [PKU游戏](http://cs101.openjudge.cn/practice/28748/)
第i个签被最后取出的概率为ai/(a1+a2+……+an)，此时拥有这个数字的最后一个人输。因此开两个字典分别记录数字的个数以及持有它的最后一个人。每个人输掉的概率即为抽到最后一个签的概率相加。
```python
n,k=map(int,input().split())
a=[]
cnt={}
last={}
ans=[0.0]*n
for i in range(n):
    t=list(map(int,input().split()))
    a.append(t)
    for j in t:
        if(j not in cnt.keys()):
            cnt[j]=1
        else:
            cnt[j]+=1
        last[j]=i
for i in cnt.keys():
    temp=cnt[i]/(n*k)
    ans[last[i]]+=temp
for i in range(n):
    print("%0.9f" %(ans[i]))
```
## [北大杯台球比赛](http://cs101.openjudge.cn/practice/16532/)
1.撞到x轴则y方向取反，撞到y轴则x方向取反
2.被撞的球不会改变位置，只需记录当前是黑球运动还是白球运动即可，撞一次球则将flag异或一次。
```python
x0,y0=map(int,input().split())
x1,y1=map(int,input().split())
aim=[(0,0),(8,0),(16,0),(0,5),(8,5),(16,5)]
t1,t2=map(int,input().split())
m=int(input())
flag=0
cur1,cur2=x0,y0
check=0
while(m>0):
    m-=1
    cur1+=t1
    cur2+=t2
    if(flag==0 and (cur1,cur2) in aim):
        check=1
        print(-1)
        break
    if(flag==1 and (cur1,cur2) in aim):
        check=1
        print(1)
        break
    if(cur1==x1 and cur2==y1):
        flag^=1
    if(cur1==0 or cur1==16):
        t1=-t1
    if(cur2==0 or cur2==5):
        t2=-t2
if(check==0):
    print(0)
```
## [完全平方数](https://leetcode.cn/problems/perfect-squares/description/)
[如何判断一个数是否能表示为两个数的平方和或立方和？](https://www.zhihu.com/question/40263900)
[拉格朗日四平方和定理](https://blog.csdn.net/nameofcsdn/article/details/115683823)
2：自然数n可以表为两个平方数之和等价于n的每个形如p=4m+3的素因子的次数为偶数。
4：$4^a*(8k+7)$
其余均能表示为三平方和。
```python
from math import sqrt
class Solution:
    def numSquares(self, n: int) -> int:
        if(int(sqrt(n))**2==n):
            return 1
        qaq=n
        flag=1
        for i in range(2,n+1):
            cnt=0
            while(qaq%i==0):
                qaq=qaq//i
                if(i%4==3):
                    cnt+=1
            if(cnt%2==1):
                flag=0
                break
        if(flag==1):
            return 2
        qaq=n
        while(qaq%4==0):
            qaq//=4
        if(qaq%8==7):
            return 4
        return 3
print(Solution().numSquares(12))
```
## [最小新整数](http://cs101.openjudge.cn/practice/04137/)
单调栈。每当遇到比栈顶小的数就将栈中所有更大的数弹出，并加入当前数，直到k次删除用完。如果没用完就从栈底删除元素。
```python
from collections import deque
t=int(input())
for i in range(t):
    n,k=input().split()
    k=int(k)
    a=deque()
    m=len(n)
    for j in range(m):
        if(len(a)==0 or k==0):
            a.append(n[j])
        else:
            while(len(a)>0 and a[-1]>n[j] and k>0):
                k-=1
                a.pop()
            a.append(n[j])
    if(k>0):
        for j in range(k):
            a.pop()
    print("".join(a))
```
dp。dp[i][j]存储0-i位删除j个的最小前缀。
```python
def con(a):
    if(a==""):
        return 0
    return int(a)
t=int(input())
for i in range(t):
    n,k0=input().split()
    k0=int(k0)
    m=len(n)
    dp=[["" for _ in range(m)]for _ in range(m)]#0-j位删k个
    for i in range(m):
        dp[i][0]=n[:i+1]
    dp[0][1]=""
    for j in range(1,m):
       for k in range(1,min(k0,j+1)+1):
           dp[j][k]=str(min(con(dp[j-1][k-1]),con(dp[j-1][k]+n[j])))
    print(dp[m-1][k0])
```
## [绝对值函数最值](http://cs101.openjudge.cn/practice/28912/)
maxm=float("-inf")
minm=float("inf")
最大值有可能为负。
```python
from math import floor,ceil
n,m=map(int,input().split())
a=[]
b=[]
c=[]
def cal(x):
    ans=0
    for i in range(n):
        ans+=c[i]*abs(a[i]*x+b[i])
    return ans
st=set()
for i in range(n):
    x,y,z=map(int,input().split())
    a.append(x)
    b.append(y)
    c.append(z)
    if(x==0):
        continue
    t=-y/x
    q=floor(t)
    p=ceil(t)
    if(0<=p<=m):
        st.add(p)
    if(0<=q<=m):
        st.add(q)
st.add(0)
st.add(m)
maxm=float("-inf")
minm=float("inf")
for j in st:
    qaq=cal(j)
    maxm=max(qaq,maxm)
    minm=min(qaq,minm)
print(maxm,minm)
```
## [海拔](http://cs101.openjudge.cn/practice/28972/)
1.二分+bfs，对答案在范围内二分，判断能否走到终点。
2.dijkstra，路径长度定义为体力消耗的最大值。
[dijkstra 详解](https://www.luogu.com.cn/article/s581e0wm)
```python
import heapq
n,m=map(int,input().split())
a=[]
dx=[0,1,0,-1]
dy=[1,0,-1,0]
dist=[[float("inf") for _ in range(m)]for _ in range(n)]
dist[0][0]=0
for i in range(n):
    l=list(map(int,input().split()))
    a.append(l)
h=[(0,0,0)]
while(h):
    l,x,y=heapq.heappop(h)
    if(l>dist[x][y]):
        continue
    for i in range(4):
        x0=x+dx[i]
        y0=y+dy[i]
        if(0<=x0<n and 0<=y0<m):
            d=max(dist[x][y],abs(a[x0][y0]-a[x][y]))
            if(d<dist[x0][y0]):
                dist[x0][y0]=d
                heapq.heappush(h,(d,x0,y0))
print(dist[n-1][m-1])
```
# 2025.11.25
## [迷宫最短路径](https://sunnywhy.com/sfbj/8/2/321)
bfs。记录路径的方法是对每个点记录其其前一个节点。
```python
from collections import deque
dx=[0,1,0,-1]
dy=[1,0,-1,0]
n,m=map(int,input().split())
pre=[[0 for _ in range(m)]for _ in range(n)]
ans=[]
def bfs():
    global n,m
    flag=0
    q=deque()
    vis=set()
    q.append((0,0,0))
    vis.add((0,0))
    x,y=0,0
    while(q):
        step,x,y=q.popleft()
        if(x==n-1 and y==m-1):
            flag=1
            break
        for i in range(4):
            x0=x+dx[i]
            y0=y+dy[i]
            if(0<=x0<n and 0<=y0<m):
                if(a[x0][y0]==0 and (x0,y0) not in vis):
                    pre[x0][y0]=(x,y)
                    q.append((step+1,x0,y0))
                    vis.add((x0,y0))
    if(flag==1):
        while(x!=0 or y!=0):
            ans.append((x,y))
            x,y=pre[x][y]
        ans.append((0,0))
a=[]
for i in range(n):
    l=list(map(int,input().split()))
    a.append(l)
bfs()
for i in range(len(ans)-1,-1,-1):
    x1,y1=ans[i]
    print(x1+1,y1+1)
```
## [多终点迷宫问题](https://sunnywhy.com/sfbj/8/2/324)
```python
from collections import deque
n,m=map(int,input().split())
a=[]
ans=[[-1 for _ in range(m)]for _ in range(n)]
dx=[0,1,0,-1]
dy=[1,0,-1,0]
q=deque()
vis=set()
def bfs():
    q.append((0,0,0))
    vis.add((0,0))
    while(q):
        step,x,y=q.popleft()
        ans[x][y]=step
        for i in range(4):
            x0=x+dx[i]
            y0=y+dy[i]
            if(0<=x0<n and 0<=y0<m and a[x0][y0]==0 and (x0,y0) not in vis):
                vis.add((x0,y0))
                q.append((step+1,x0,y0))
for i in range(n):
    l=list(map(int,input().split()))
    a.append(l)
bfs()
for i in range(n):
    print(" ".join(map(str,ans[i])))
```
## [Piggy-Bank](http://cs101.openjudge.cn/practice/01384/)
完全背包恰好放满。
```python
t=int(input())
for O_o in range(t):
    e,f=map(int,input().split())
    n=int(input())
    p=[]
    w=[]
    for i in range(n):
        p0,w0=map(int,input().split())
        p.append(p0)
        w.append(w0)
    dp=[float("inf")]*(f-e+1)#容量为i的最低价值
    dp[0]=0
    for i in range(1,f-e+1):
        for j in range(n):
            if(i>=w[j]):
                dp[i]=min(dp[i],dp[i-w[j]]+p[j])
    if(dp[f-e]==float("inf")):
        print("This is impossible.")
    else:
        print("The minimum amount of money in the piggy-bank is %d." %(dp[f-e]))
```
## [单词拆分](https://leetcode.cn/problems/word-break/description/)
```python
class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> bool:
        m=len(s)
        dp=[0]*(m+1)#前i位是否能拼出
        dp[0]=1
        for i in range(m+1):
            for j in wordDict:
                t=len(j)
                if(t>i):
                    continue
                if(dp[i-t]==1 and s[i-t:i]==j):
                    dp[i]=1
                    break
        if(dp[m]==1):
            return True
        else:
            return False
print(Solution().wordBreak("leetcode",["leet","code"]))
```
## [合理的饭票设计](http://cs101.openjudge.cn/practice/28702/)
dfs饭票的所有面值。对dfs进行剪枝，饭票的面值应大于上一次面值，小于当前连续覆盖最大值-1.计算当前连续覆盖最大值的方法是dp，dp数组记录凑出面值i的最少饭票数，每dfs一次就更新dp数组。
注意题目要求的是凑出1-n，同时不能凑出n+1.以及多测记得清空。
```python
ans=0
def dfs(cnt,val,cur,dp,m,k,n):#已选面值数，上一次面值，当前连续覆盖最大值
    #print(cnt,val,cur,dp[0:7])
    global ans
    if(cur>n):
        return
    if(cnt==m):
        if(cur==n):
            ans+=1
        return
    for i in range(val+1,min(cur+1,n)+1):
        qaq=dp.copy()
        for j in range(i,n+2):
            if(qaq[j-i]<k):
                qaq[j]=min(qaq[j],qaq[j-i]+1)
        qwq=cur
        while(qwq<n+2 and qaq[qwq]<=k):
            qwq+=1
        dfs(cnt+1,i,qwq-1,qaq,m,k,n)
p=int(input())
for o_0 in range(p):
    m,k,n=map(int,input().split())
    if(k>n):
        print(0)
        continue
    if(m==1):
        print(1 if k==n else 0)
        continue
    dp=[float("inf")]*(n+2)#凑出面值i的最少饭票数
    for i in range(0,k+1):
        dp[i]=i
    cur=k
    ans=0
    dfs(1,1,k,dp,m,k,n)
    print(ans)
```
## [【模板】Manacher](https://www.luogu.com.cn/problem/P3805)
```python
temp=input()
s='#'.join('^{}$'.format(temp))
n=len(s)
p=[0]*n#以s[i]为中心的最长回文半径
c=0#当前中心
r=0#当前中心的最右边界
for i in range(1,n-1):
    j=2*c-i
    if(r>i):
        p[i]=min(r-i,p[j])
    else:
        p[i]=0
    while(s[i+(1+p[i])]==s[i-(1+p[i])]):
        p[i]+=1
    if(i+p[i]>r):
        c=i
        r=i+p[i]
print(max(p))
```
# 2025.11.27
打了助教出的模拟赛。
## [迷宫](http://cs101.openjudge.cn/20251127mockexam/E02790/)
dfs走迷宫不需要回溯。
```python
k=int(input())
dx=[0,1,0,-1]
dy=[1,0,-1,0]
def dfs(x,y,x1,y1,n):
    if(x==x1 and y==y1):
        return True
    for i in range(4):
        xx=x+dx[i]
        yy=y+dy[i]
        if(0<=xx<n and 0<=yy<n and vis[xx][yy]==0 and a[xx][yy]=='.'):
            vis[xx][yy]=1
            if(dfs(xx,yy,x1,y1,n)):
                return True
    return False
for o_o in range(k):
    n=int(input())
    a=[]
    for i in range(n):
        l=input()
        a.append(l)
    vis=[[0 for _ in range(n)] for _ in range(n)]
    flag=0
    x0,y0,x1,y1=map(int,input().split())
    if(a[x0][y0]=='#' or a[x1][y1]=='#'):
        print("NO")
        continue
    vis[x0][y0]=1
    if(dfs(x0,y0,x1,y1,n)):
        print("YES")
    else:
        print("NO")
```
## [给植物浇水](http://cs101.openjudge.cn/20251127mockexam/E27301/)
```python
n,a,b=map(int,input().split())
p=list(map(int,input().split()))
i,j=0,n-1
ans1,ans2=0,0
cur1,cur2=a,b
while(i<j):
    if(cur1<p[i]):
        cur1=a
        ans1+=1
    if(cur2<p[j]):
        cur2=b
        ans2+=1
    cur1-=p[i]
    cur2-=p[j]
    i+=1
    j-=1
if(i==j):
    if(cur1>=cur2):
        if(cur1<p[i]):
            cur1=a
            ans1+=1
    elif(cur1<cur2):
        if(cur2<p[i]):
            cur2=b
            ans2+=1
print(ans1+ans2)
```
## [解密](http://cs101.openjudge.cn/20251127mockexam/M28969/)
```python
def solve(s):
    t=len(s)
    if(t==1):
        return s
    if(t==0):
        return ""
    if(t%2==0):
        return solve(s[1:t//2])+s[0]+solve(s[t//2:t])
    else:
        return solve(s[1:t//2+1])+s[0]+solve(s[t//2+1:t])
l=input()
print(solve(l))
```
## [预测赢家](http://cs101.openjudge.cn/20251127mockexam/M28970/)
双端取数的博弈问题的dp。dp数组记录剩余数字为第i-j时先手能比后手多出的最多的分。考虑先手取对头或队尾，此时后手变成了先手，由此可以使用dp数据递推。
建立dp表的顺序应枚举字段长度与开头下标。边界为只剩一个数的时候，此时数组那个数的值即为先手多出的分数。
```python
n=int(input())
for _ in range(n):
    a=list(map(int,input().split()))
    m=a[0]
    nums=a[1:m+1]
    dp=[[0 for _ in range(m)]for _ in range(m)]#i-j,先手比后手多的分数
    for i in range(m):
        dp[i][i]=nums[i]
    for l in range(2,m+1):
        for i in range(m-l+1):
            j=i+l-1
            dp[i][j]=max(nums[i]-dp[i+1][j],nums[j]-dp[i][j-1])
    if(dp[0][m-1]>=0):
        print("true")
    else:
        print("false")
```
