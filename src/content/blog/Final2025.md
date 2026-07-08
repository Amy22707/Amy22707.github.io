---
title: 25fall做题记录 - Christmas
description: CS101计算概论期末考试
publishedAt: 2025-12-25
tags:
  - 算法
  - Python
---
期末机考游记。
## [春游集合](http://cs101.openjudge.cn/cs1012025feclass11/E30061/)
桶。
```python
n,m=map(int,input().split())
a=list(map(int,input().split()))
b=[0]*n
for i in range(m):
    b[a[i]]+=1
res=[]
for i in range(n):
    if(b[i]==0):
        res.append(i)
if(len(res)==0):
    print(n)
else:
    print(" ".join(map(str,res)))
```
## [纪念品分组](http://cs101.openjudge.cn/cs1012025feclass11/E30085/)
排序+双指针。
```python
w=int(input())
n=int(input())
a=[]
for i in range(n):
    t=int(input())
    a.append(t)
a.sort()
ans=0
l=0
r=n-1
while(l<=r):
    if(l==r):
        ans+=1
        break
    if(a[l]+a[r]<=w):
        ans+=1
        l+=1
        r-=1
    else:
        ans+=1
        r-=1
print(ans)
```
## [非递减子序列](http://cs101.openjudge.cn/cs1012025feclass11/M30062/)
赛时做法是dfs，最后排序去重，n比较小所以也能过。
正解考虑转成字符串然后哈希去重或者搜索时剪枝。
![image](https://img2024.cnblogs.com/blog/2669443/202512/2669443-20251225172134040-1412425499.png)
```python
a=list(map(int,input().split()))
n=len(a)
ans=0
res=[]
def dfs(cur,qaq):
    global ans
    for i in range(cur + 1, n):
        if(a[i]>=a[cur]):
            qwq=qaq.copy()
            qwq.append(a[i])
            res.append(qwq)
            dfs(i,qwq)
for i in range(n):
    dfs(i,[a[i]])
res.sort()
i=0
while(i<len(res)):
    while(i+1<len(res) and res[i]==res[i+1]):
        i+=1
    ans+=1
    i+=1
print(ans)
```
## [赦免战俘](http://cs101.openjudge.cn/cs1012025feclass11/M30216/)
递归。
```python
def op(m,x,y):
    if(m==1):
        a[x][y]=0
        a[x+1][y]=1
        a[x][y+1]=1
        a[x+1][y+1]=1
        return
    t=2**(m-1)
    for i in range(x,x+t):
        for j in range(y,y+t):
            a[i][j]=0
    op(m-1,x+t,y)
    op(m-1,x,y+t)
    op(m-1,x+t,y+t)
n=int(input())
a=[[0 for _ in range(2**n)]for _ in range(2**n)]
op(n,0,0)
for i in range(2**n):
    print(" ".join(map(str,a[i])))
```
## [上课赶时间](http://cs101.openjudge.cn/cs1012025feclass11/M30442/)
先扫一遍判断删除哪个点对结果的贡献最大，然后删除即可。注意特判开头结尾。
```python
t=int(input())
for _ in range(t):
    n=int(input())
    a=list(map(int,input().split()))
    ans=0
    res=-1
    maxm=0
    for i in range(1,n-1):
        if((a[i]>a[i-1] and a[i]>a[i+1]) or (a[i]<a[i-1] and a[i]<a[i+1])):
            t=abs(a[i]-a[i-1])+abs(a[i]-a[i+1])-abs(a[i-1]-a[i+1])
            if(t>maxm):
                maxm=t
                res=i
    t1=abs(a[0]-a[1])
    t2=abs(a[n-1]-a[n-2])
    if(t1>maxm):
        maxm=t1
        res=0
    if(t2>maxm):
        maxm=t2
        res=n-1
    ans1=0
    for i in range(n-1):
        ans1+=abs(a[i]-a[i+1])
    del(a[res])
    for i in range(n-2):
        ans+=abs(a[i]-a[i+1])
    print(min(ans,ans1))
```
## [星际贸易航线](http://cs101.openjudge.cn/cs1012025feclass11/T30220/)
双dp。yhf考前明示最有用的一集。
```python
n,m=map(int,input().split())
a=[]
for i in range(n):
    t=list(map(int,input().split()))
    a.append(t)
dp=[[[float("-inf") for _ in range(2)]for _ in range(m)]for _ in range(n)]#dp[i][j][k]:arriving at a[i][j], using k shields, maximum gains
if(a[0][0]>=0):
    dp[0][0][0]=dp[0][0][1]=a[0][0]
else:
    dp[0][0][0]=a[0][0]
    dp[0][0][1]=-a[0][0]
for i in range(1,m):
    if(a[0][i]>=0):
        dp[0][i][0]=dp[0][i-1][0]+a[0][i]
        dp[0][i][1] = dp[0][i - 1][1] + a[0][i]
    else:
        dp[0][i][0]=dp[0][i-1][0]+a[0][i]
        dp[0][i][1] =max(dp[0][i - 1][1] + a[0][i],dp[0][i-1][0]-a[0][i])
for i in range(1,n):
    if(a[i][0]>=0):
        dp[i][0][0]=dp[i-1][0][0]+a[i][0]
        dp[i][0][1] = dp[i - 1][0][1] + a[i][0]
    else:
        dp[i][0][0] = dp[i - 1][0][0] + a[i][0]
        dp[i][0][1] =max(dp[i - 1][0][1] + a[i][0],dp[i-1][0][0]-a[i][0])
for i in range(1,n):
    for j in range(1,m):
        if(a[i][j]>=0):
            dp[i][j][0]=max(dp[i-1][j][0],dp[i][j-1][0])+a[i][j]
            dp[i][j][1]=max(dp[i - 1][j][1], dp[i][j - 1][1]) + a[i][j]
        else:
            dp[i][j][0] = max(dp[i - 1][j][0], dp[i][j - 1][0]) + a[i][j]
            dp[i][j][1] = max(dp[i - 1][j][1]+a[i][j], dp[i][j - 1][1]+a[i][j],dp[i - 1][j][0]-a[i][j], dp[i][j - 1][0]-a[i][j])
print(max(dp[n-1][m-1][0],dp[n-1][m-1][1]))
```
