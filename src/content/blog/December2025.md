---
title: 25fall做题记录 - December
description: 2025.12做题记录
publishedAt: 2025-12-01
tags:
  - 算法
  - Python
---
# 2025.12.1
## [乘积最大子数组](https://leetcode.cn/problems/maximum-product-subarray/description/)
由于可能出现两个负数相乘，考虑同时记录最大子数组与最小子数组，两个数组都由上述两个转移而来。
```python
class Solution:
    def maxProduct(self, nums: list[int]) -> int:
        n=len(nums)
        dpmax=nums.copy()
        dpmin=nums.copy()
        for i in range(1,n):
            dpmax[i]=max(dpmax[i-1]*nums[i],dpmin[i-1]*nums[i],dpmax[i])
            dpmin[i]=min(dpmin[i-1]*nums[i],dpmax[i-1]*nums[i],dpmin[i])
        return(max(dpmax))
print(Solution().maxProduct([2,3,-2,4]))
```
## [Pots](http://cs101.openjudge.cn/practice/03151/)
```python
from collections import deque
a,b,c=map(int,input().split())
ans=[]
flag=0
def bfs():
    global a,b,c,flag
    q=deque()
    q.append((0,0,[]))
    vis=set()
    vis.add((0,0))
    while(q):
        (x,y,path)=q.popleft()
        if(x==c or y==c):
            flag=1
            return path
            break
        if(x!=a and (a,y) not in vis):
            q.append((a,y,path+['FILL(1)']))
            vis.add((a,y))
        if(y!=b and (x,b) not in vis):
            q.append((x,b,path+['FILL(2)']))
            vis.add((x,b))
        if(x!=0 and (0,y) not in vis):
            q.append((0,y,path+['DROP(1)']))
            vis.add((0,y))
        if(y!=0 and (x,0) not in vis):
            q.append((x,0,path+['DROP(2)']))
            vis.add((x,0))
        if(x>0 and y<b):
            if(x>b-y and (x-(b-y),b) not in vis):
                q.append((x-(b-y),b,path+['POUR(1,2)']))
                vis.add((x-(b-y),b))
            if(x<=b-y and (0,y+x) not in vis):
                q.append((0,y+x,path+['POUR(1,2)']))
                vis.add((0,y+x))
        if(y>0 and x<a):
            if(y>a-x and (a,y-(a-x)) not in vis):
                q.append((a,y-(a-x),path+['POUR(2,1)']))
                vis.add((a,y-(a-x)))
            if(y<=a-x and (x+y,0) not in vis):
                q.append((x+y,0,path+['POUR(2,1)']))
                vis.add((x+y,0))
ans=bfs()
if(flag==0):
    print("impossible")
else:
    print(len(ans))
    for i in range(len(ans)):
        print(ans[i])
```
## [土豪购物](http://cs101.openjudge.cn/pctbook/M20744/)
没有局部最优性，考虑开两个dp数组，分别记录不放回和放回一个。
```python
a=list(map(int,input().split(',')))
n=len(a)
dp1=a.copy()#不放回
dp2=[0]*n#放回
dp2[0]=a[0]
for i in range(1,n):
    dp1[i]=max(dp1[i-1]+a[i],a[i])
    dp2[i]=max(dp1[i-1],dp2[i-1]+a[i],a[i])
print(max(max(dp1),max(dp2)))
```
## [Vacations](https://codeforces.com/problemset/problem/698/A)
开三个dp数组分别记录第i天休息、打比赛或者锻炼。
```python
n=int(input())
a=list(map(int,input().split()))
maxm=float("inf")
dp1=[maxm]*n#第i天rest的最少休息天数
dp2=[maxm]*n#sport
dp3=[maxm]*n#contest
dp1[0]=1
if(a[0]==1 or a[0]==3):
    dp3[0]=0
if(a[0]==2 or a[0]==3):
    dp2[0]=0
for i in range(1,n):
    if(a[i]==1 or a[i]==3):
        dp3[i]=min(dp2[i-1],dp1[i-1])
    if(a[i]==2 or a[i]==3):
        dp2[i]=min(dp3[i-1],dp1[i-1])
    dp1[i]=min(dp1[i-1]+1,dp2[i-1]+1,dp3[i-1]+1)
print(min(dp1[n-1],dp2[n-1],dp3[n-1]))
```
## [Basketball Exercise](https://codeforces.com/problemset/problem/1195/C)
```python
n=int(input())
a=list(map(int,input().split()))
b=list(map(int,input().split()))
dp1=[0]*n
dp2=[0]*n
dp1[0]=a[0]
dp2[0]=b[0]
for i in range(1,n):
    dp1[i]=max(dp2[i-1]+a[i],dp1[i-1])
    dp2[i]=max(dp1[i-1]+b[i],dp2[i-1])
print(max(max(dp1),max(dp2)))
```
## [Boredom](https://codeforces.com/problemset/problem/455/A)
```python
n=int(input())
a=list(map(int,input().split()))
nums={}
for i in range(n):
    if(a[i] in nums.keys()):
        nums[a[i]]+=1
    else:
        nums[a[i]]=1
keys=sorted(nums)
m=len(keys)
dp=[0]*(m)#keys[0]-keys[i]删除的最多得分
dp[0]=nums[keys[0]]*keys[0]
for i in range(1,m):
    if(keys[i]==keys[i-1]+1):
        if(i==1):
            dp[i] = max(dp[i - 1],nums[keys[i]]*keys[i])
        else:
            dp[i] = max(dp[i - 1], dp[i - 2] + nums[keys[i]]*keys[i])
    else:
        dp[i]=dp[i-1]+nums[keys[i]]*keys[i]
print(dp[m-1])
```
## [[NOIP2025] 糖果店 / candy](https://www.luogu.com.cn/problem/P14635)
购买大于等于两个的糖果至多有一种，否则可以都换成最小的那种。因此枚举买一个的糖果总数与买两个的次数。
```python
n,m=map(int,input().split())
a=[]
c=[]
for i in range(n):
    x,y=map(int,input().split())
    a.append(x)
    c.append(x+y)
t=min(c)
a.sort()
res=0
pre=[0]
for i in range(n):
    pre.append(pre[i]+a[i])
for i in range(n+1):
    if(pre[i]>m):
        break
    qwq=(m-pre[i])//t
    ans=qwq*2+i
    res=max(res,ans)
print(res)
```
# 2025.12.3
## [袋子里最少数目的球](https://leetcode.cn/problems/minimum-limit-of-balls-in-a-bag/description/)
二分答案。
```python
class Solution:
    def minimumSize(self, nums: list[int], maxOperations: int) -> int:
        l,r,ans=1,max(nums),0
        while(l<=r):
            mid=(l+r)>>1
            res=0
            for i in nums:
                res+=(i-1)//mid
            if(res<=maxOperations):
                ans=mid
                r=mid-1
            else:
                l=mid+1
        return ans
```
## [编辑距离](https://leetcode.cn/problems/edit-distance/description/)
dp数组记录从word1的0-i位置变到word2的0-j位置需要的最少步数。分word1[i]与word2[j]是否相等讨论。
dp[i-1][j-1]为替换，dp[i-1][j]为插入，dp[i][j-1]为删除。边界条件为word1为空或word2为空，因此细节上注意word的1-n对应原字符串的0-n-1
```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        n1=len(word1)#1-n1
        n2=len(word2)
        dp=[[0 for _ in range(n2+1)]for _ in range(n1+1)]#word1i位置换到word2j位置最少步数
        for i in range(1,n2+1):
            dp[0][i]=dp[0][i-1]+1
        for i in range(1,n1+1):
            dp[i][0]=dp[i-1][0]+1
        for i in range(1,n1+1):
            for j in range(1,n2+1):
                if(word1[i-1]==word2[j-1]):
                    dp[i][j]=dp[i-1][j-1]
                else:
                    dp[i][j]=min(dp[i-1][j-1],dp[i-1][j],dp[i][j-1])+1
        return dp[n1][n2]

print(Solution().minDistance("horse","ros"))
```
## [Aggressive cows](http://cs101.openjudge.cn/practice/02456/)
二分答案。
```python
n,c=map(int,input().split())
a=[]
for i in range(n):
    t=int(input())
    a.append(t)
a.sort()
l,r=1,max(a)-min(a)
ans=0
while(l<=r):
    mid=(l+r)>>1
    # print("TEST",mid)
    cur=0
    res=1
    t=a[cur]+mid
    while(cur<n):
        if(a[cur]>=t):
            res+=1
            t=a[cur]+mid
        cur+=1
    if(res>=c):
        ans=mid
        l=mid+1
    else:
        r=mid-1
print(ans)
```
# 2025.12.4
## [神秘数字的宇宙旅行](http://cs101.openjudge.cn/20251204mockexam/E29945/)
```python
n=int(input())
while(n!=1):
    if(n%2==1):
        t=n*3+1
        print("%d*3+1=%d" %(n,t))
        n=t
    else:
        t=n//2
        print("%d/2=%d" %(n,t))
        n=t
print("End")
```
## [删数问题](http://cs101.openjudge.cn/20251204mockexam/E29946/)
单调栈。维护一个单调增的栈，如果后面的数字符合要求就入栈，不符合就把栈中所有比它大的元素都出栈。贪心可知这样操作后栈中的数即为最小的数。
注意如果以字符串形式输出，要把数字中多余的前导零删除，例如100删一位应当为0，而栈中存储的是00.
```python
from collections import deque
a=input().lstrip('0')
k=int(input())
n=len(a)
q=deque()
for i in range(n):
    if(len(q)==0 or k==0):
        q.append(a[i])
    else:
        while(len(q)>0 and a[i]<q[-1] and k>0):
            q.pop()
            k-=1
        q.append(a[i])
if(k>0):
    for i in range(k):
        q.pop()
ans=0
while(len(q)>0):
    ans*=10
    ans+=ord(q.popleft())-ord('0')
print(ans)
```
## [缺德的图书馆管理员](http://cs101.openjudge.cn/20251204mockexam/E30091/)
贪心。两个同学速度相同，因此相遇后转身用时相当于互换身份后不转身用时。因此同学的离开时间只能是a[i]或l+1-a[i].
```python
l=int(input())
n=int(input())
a=list(map(int,input().split()))
a.sort()
minm=0
maxm=0
for i in range(n):
    minm=max(minm,min(a[i],l+1-a[i]))
maxm=max(max(a),l+1-min(a))
print(minm,maxm)
```
## [小P的LLM推理加速](http://cs101.openjudge.cn/20251204mockexam/T30204/)
```python
n,m=map(int,input().split())
a=[]
c=[]
for i in range(n):
    x,y=map(int,input().split())
    a.append(x)
    c.append(x+y)
t=min(c)
a.sort()
res=0
pre=[0]
for i in range(n):
    pre.append(pre[i]+a[i])
for i in range(n+1):
    if(pre[i]>m):
        break
    qwq=(m-pre[i])//t
    ans=qwq*2+i
    res=max(res,ans)
print(res)
```
## [Playfair密码](http://cs101.openjudge.cn/practice/27371/)
纯模拟。注意j要换成i，不仅构造矩阵的时候要删除j，接收明文的时候也要把其中所有的j替换为一个i。
```python
a=input()
n=int(input().strip())
m=[["" for _ in range(5)]for _ in range(5)]
t=len(a)
qwq=[]
qaq=set()
for i in range(t):
    if(a[i]=='j'):
        if('i' not in qaq):
            qaq.add('i')
            qwq.append('i')
    else:
        if(a[i] not in qaq):
            qaq.add(a[i])
            qwq.append(a[i])
t=len(qaq)
cur=0
for i in range(26):
    tmp=chr(ord('a')+i)
    if(tmp=='j'):
        continue
    if(tmp not in qaq):
        qwq.append(tmp)
for i in range(5):
    for j in range(5):
        m[i][j]=qwq[cur]
        cur+=1
def op(s):
    qaq=[]
    cur=0
    while(cur+1<len(s)):
        t1, t2 = s[cur], s[cur + 1]
        if(t1!=t2):
            qaq.append((t1,t2))
            cur+=2
        else:
            if(t1!='x'):
                qaq.append((t1,'x'))
                cur+=1
            else:
                qaq.append((t1,'q'))
                cur+=1
    if(cur==len(s)-1):
        t=s[cur]
        if(t!='x'):
            qaq.append((t,'x'))
        else:
            qaq.append((t,'q'))
    return qaq
def search(x):
    for i in range(5):
        for j in range(5):
            if(m[i][j]==x):
                return i,j
for _ in range(n):
    t=input()
    s=""
    for i in t:
        if(i=='j'):
            s=s+'i'
        else:
            s=s+i
    ans=""
    lst=op(s)
    for i in range(len(lst)):
        p,q=lst[i]
        pi,pj=search(p)
        qi,qj=search(q)
        if(pi==qi):
            pj=(pj+1)%5
            qj=(qj+1)%5
        elif(pj==qj):
            pi=(pi+1)%5
            qi=(qi+1)%5
        else:
            pj,qj=qj,pj
        ans=ans+m[pi][pj]+m[qi][qj]
    print(ans)
```
# 2025.12.8
## [旅行售货商问题](http://cs101.openjudge.cn/practice/30201/)
状压dp。由于路径是一个环，考虑将起点固定为0号点。dp[i][j]记录从0到j，状态为i时的最短路径。
枚举状态和目标点j。对每个途径的k点，使用类似Floyd算法对最短路进行更新。
最终答案即为从0到所有点的最短路加上从这个点回到0点的路径和的最小值。
```python
n=int(input())
a=[]
for i in range(n):
    t=list(map(int,input().split()))
    a.append(t)
dp=[[float("inf") for _ in range(n)]for _ in range(1<<n)]#从起点到j号点，状态为i时的最短路
dp[1][0]=0
for i in range(1<<n):
    if(i&1==0):
        continue
    for j in range(n):
        if((1<<j)&i)==0:
            for k in range(n):
                if((1<<k)&i):
                    dp[i|(1<<j)][j]=min(dp[i|(1<<j)][j],dp[i][k]+a[k][j])
minm=float("inf")
for i in range(n):
    minm=min(minm,dp[(1<<n)-1][i]+a[i][0])
print(minm)
```
## [ [POI 2004] PRZ](https://www.luogu.com.cn/problem/P5911)
状压dp枚举子集。j=i&(j-1).复杂度O(3^n).
对每个状态枚举其子集，用剩余的直接过桥时间加子集的dp值更新之。
注意子集包括0，不要碰到零就停止枚举。
```python
a,n=map(int,input().split())
t0=[]
w0=[]
t=[0]*(1<<n)
w=[0]*(1<<n)
for i in range(n):
    x,y=map(int,input().split())
    t0.append(x)
    w0.append(y)
for i in range(1<<n):
    for j in range(n):
        if((1<<j)&i):
            t[i]=max(t[i],t0[j])
            w[i]+=w0[j]
dp=[float("inf")]*(1<<n)
dp[0]=0
for i in range(1,1<<n):
    j=i
    while(True):
        if(w[i^j]<=a):
            dp[i]=min(dp[i],dp[j]+t[i^j])
        if(j==0):
            break
        j=i&(j-1)
print(dp[(1<<n)-1])
```
## [走山路](http://cs101.openjudge.cn/practice/20106/)
dijkstra.
```python
import heapq
m,n,p=map(int,input().split())
a=[]
dx=[0,1,0,-1]
dy=[1,0,-1,0]
for i in range(m):
    t=list(input().split())
    a.append(t)
for _ in range(p):
    x0,y0,x1,y1=map(int,input().split())
    h=[(0,x0,y0)]
    dis=[[float("inf") for _ in range(n)]for _ in range(m)]
    flag=0
    if(a[x0][y0]=='#' or a[x1][y1]=='#'):
        print("NO")
        continue
    while(h):
        l,x,y=heapq.heappop(h)
        if(x==x1 and y==y1):
            print(l)
            flag=1
            break
        for i in range(4):
            xx=x+dx[i]
            yy=y+dy[i]
            if(0<=xx<m and 0<=yy<n and a[xx][yy]!='#'):
                d=l+abs(int(a[xx][yy])-int(a[x][y]))
                if(d<dis[xx][yy]):
                    dis[xx][yy]=d
                    heapq.heappush(h,(d,xx,yy))
    if(flag==0):
        print("NO")
```
## [Subway](http://cs101.openjudge.cn/practice/02502/)
dijkstra.
```python
from math import sqrt
import heapq
def get_dis(x,y):
    a,b=x
    c,d=y
    t=(a-c)**2+(b-d)**2
    return sqrt(t)
x0,y0,x1,y1=map(int,input().split())
stations=[(x0,y0),(x1,y1)]
subway=[]
while(True):
    try:
        t=list(map(int,input().split()))
        if(t==[-1,-1]):
            continue
        qaq=len(t)
        tot=[]
        for i in range(0,qaq-2,2):
            tot.append((t[i],t[i+1]))
            stations.append((t[i],t[i+1]))
        subway.append(tot)
    except EOFError:
        break
n=len(stations)
dis=[[float("inf") for _ in range(n)]for _ in range(n)]
for i in range(n):
    for j in range(i,n):
        if(i==j):
            dis[i][j]=0
        else:
            dis[i][j]=dis[j][i]=get_dis(stations[i],stations[j])/(10/3.6)
for s in subway:
    tmp=len(s)
    for i in range(tmp-1):
        t0=stations.index(s[i])
        t1=stations.index(s[i+1])
        dis[t0][t1]=dis[t1][t0]=get_dis(s[i],s[i+1])/(40/3.6)
h=[(0,0)]
path=[float("inf")]*n
path[0]=0
while(h):
    l,cur=heapq.heappop(h)
    if(l>path[cur]):
        continue
    for i in range(n):
        d=l+dis[i][cur]
        if(d<path[i]):
            path[i]=d
            heapq.heappush(h,(d,i))
print(round(path[1]/60))
```
## [【模板】KMP](https://www.luogu.com.cn/problem/P3375)
[字符串学习笔记 · 浅析KMP——单模式串匹配算法](https://www.luogu.com.cn/article/qsgkbcp0)
```python
a="_"+input().strip()
b="_"+input().strip()
l1=len(a)
l2=len(b)
j=0
kmp=[0]*l2
for i in range(2,l2):
    while(j>0 and b[i]!=b[j+1]):
        j=kmp[j]
    if(b[j+1]==b[i]):
        j+=1
    kmp[i]=j
j=0
for i in range(1,l1):
    while(j>0 and b[j+1]!=a[i]):
        j=kmp[j]
    if(b[j+1]==a[i]):
        j+=1
    if(j==l2-1):
        print(i-l2+2)
        j=kmp[j]
for i in range(1,l2):
    print(kmp[i],end=" ")
```
还有神秘0分。
![image](https://img2024.cnblogs.com/blog/2669443/202512/2669443-20251209005125412-1632209076.png)
![d0cb4cf787ce4ce6960eae1391317e42](https://img2024.cnblogs.com/blog/2669443/202512/2669443-20251209152229657-215740259.png)

# 2025.12.9
## [快速堆猪](http://cs101.openjudge.cn/practice/22067/)
辅助栈。加一个栈记录最小值，最小值栈每次添加的即为当前元素与栈顶元素中的较小值。
```python
a=[]
m=[]
while True:
    try:
        s=input().split()
        if(s[0]=='pop'):
            if(len(a)>0):
                a.pop()
                m.pop()
        elif(s[0]=='min'):
            if(len(m)>0):
                print(m[-1])
        else:
            t=int(s[1])
            a.append(t)
            if(len(m)==0):
                m.append(t)
            else:
                m.append(min(m[-1],t))
    except EOFError:
        break
```
## [我是最快的马](http://cs101.openjudge.cn/pctbook/T07206/)
点可能会重复经过，vis数组记录经过每个点的路径长度最小值，当新路径的长度小于等于当前路径的时候才进行搜索。
```python
from collections import deque
a=[[0 for _ in range(11)]for _ in range(11)]
dx=[-2,-2,-1,1,2,2,1,-1]
dy=[-1,1,2,2,1,-1,-2,-2]
hx=[-1,-1,0,0,1,1,0,0]
hy=[0,0,1,1,0,0,-1,-1]
x0,y0=map(int,input().split())
x1,y1=map(int,input().split())
m=int(input())
for i in range(m):
    x,y=map(int,input().split())
    a[x][y]=1
ans=0
flag=float("inf")
h=deque()
h.append((0,x0,y0,[(x0,y0)]))
vis=[[float("inf") for _ in range(11)]for _ in range(11)]
res=[]
while(h):
    l,x,y,path=h.popleft()
    if(l>flag):
        break
    if(x==x1 and y==y1):
        flag=l
        ans+=1
        res.append(path)
        continue
    for i in range(8):
        xx,yy,xxx,yyy=x+dx[i],y+dy[i],x+hx[i],y+hy[i]
        if(0<=xx<=10 and 0<=yy<=10):
            if(a[xx][yy]==1 or a[xxx][yyy]==1 or l+1>vis[xx][yy]):
                continue
            vis[xx][yy]=l+1
            h.append((l+1,xx,yy,path+[(xx,yy)]))
if(ans==1):
    for i in range(len(res[0])-1):
        x,y=res[0][i]
        print("(%d,%d)" %(x,y),end='-')
    x,y=res[0][-1]
    print("(%d,%d)" %(x,y))
else:
    print(ans)
```
## [蛇梯棋](https://leetcode.cn/problems/snakes-and-ladders/description/)
```python
from collections import deque
class Solution:
    def snakesAndLadders(self, board: list[list[int]]) -> int:
        n=len(board)
        a=[[0 for _ in range(n)]for _ in range(n)]
        x=n-1
        y=0
        dir=1
        idx=[(-1,-1)]
        for i in range(1,n*n+1):
            a[x][y]=i
            idx.append((x,y))
            if(dir==1):
                y=y+1
                if(y==n):
                    y=n-1
                    x=x-1
                    dir=-1
            elif(dir==-1):
                y=y-1
                if(y==-1):
                    y=0
                    x=x-1
                    dir=1
        q=deque()
        vis=[float("inf")]*(n*n+1)
        q.append((0,1))
        flag=0
        while(q):
            l,cur=q.popleft()
            if(cur==n*n):
                flag=1
                return l
            for i in range(1,7):
                t=cur+i
                if(t>n*n):
                    continue
                x1,y1=idx[t]
                if(board[x1][y1]!=-1):
                    t=board[x1][y1]
                if(t<=n*n and vis[t]>l+1):
                    vis[t]=l+1
                    q.append((l+1,t))
        if(flag==0):
            return -1
print(Solution().snakesAndLadders([[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,35,-1,-1,13,-1],[-1,-1,-1,-1,-1,-1],[-1,15,-1,-1,-1,-1]]))
```
## [最小基因变化](https://leetcode.cn/problems/minimum-genetic-mutation/description/)
bfs.
```python
from collections import deque
class Solution:
    def minMutation(self, startGene: str, endGene: str, bank: list[str]) -> int:
        g=['A','T','C','G']
        q=deque()
        q.append((0,startGene))
        vis=set()
        vis.add(startGene)
        if(endGene not in bank):
            return -1
        flag=0
        while(q):
            l,s=q.popleft()
            if(s==endGene):
                flag=1
                return l
            for i in range(8):
                for j in range(4):
                    ng=s[:i]+g[j]+s[i+1:]
                    if(ng not in bank or ng in vis):
                        continue
                    q.append((l+1,ng))
                    vis.add(ng)
        if(flag==0):
            return -1
print(Solution().minMutation("AACCGGTT","AAACGGTA",["AACCGGTA","AACCGCTA","AAACGGTA"]))
print(Solution().minMutation("AAAAACCC","AACCCCCC",["AAAACCCC","AAACCCCC","AACCCCCC"]))
```
## [Find The Multiple](http://cs101.openjudge.cn/practice/01426/)
目标数只由0与1构成，可看成一棵二叉树。从1开始，每次向后加0或1。只关心当前数模n的余数，因此每一步搜索只记录余数，当已经搜到余数了就可以跳过这个节点。
```python
from collections import deque
while(True):
    n=int(input())
    if(n==0):
        break
    if(n==1):
        print(1)
        continue
    vis=[0]*n
    q=deque()
    q.append(("1",1))
    vis[1]=1
    while(q):
        s,m=q.popleft()
        if(m==0):
            print(s)
            break
        t1=m*10%n
        t2=(m*10+1)%n
        if(vis[t1]==0):
            vis[t1]=1
            q.append((s+"0",t1))
        if(vis[t2]==0):
            vis[t2]=1
            q.append((s+"1",t2))
```
## [放苹果](http://cs101.openjudge.cn/practice/01664/)
至少有一个盘子为空：dp[i][j-1].所有盘子都满：dp[i-j][j]
```python
t=int(input())
for i in range(t):
    m,n=map(int,input().split())
    dp=[[0 for _ in range(n+1)]for _ in range(m+1)]
    for i in range(m+1):
        dp[i][0]=dp[i][1]=1
    for i in range(n+1):
        dp[0][i]=dp[1][i]=1
    for i in range(2,m+1):
        for j in range(2,n+1):
            dp[i][j]=dp[i-j][j]+dp[i][j-1]
    print(dp[m][n])
```
## [两座孤岛最短距离](http://cs101.openjudge.cn/pctbook/T20741/)
dfs搜连通分量，对其中的每一个点同时bfs。
```python
from collections import deque
n=int(input())
a=[]
q=deque()
vis=set()
dx=[0,1,0,-1]
dy=[1,0,-1,0]
def dfs(x,y):
    for i in range(4):
        xx=x+dx[i]
        yy=y+dy[i]
        if(0<=xx<n and 0<=yy<n and a[xx][yy]=='1' and (xx,yy) not in vis):
            vis.add((xx,yy))
            q.append((0,xx,yy))
            dfs(xx,yy)
for i in range(n):
    t=list(input())
    a.append(t)
flag=0
for i in range(n):
    if(flag==1):
        break
    for j in range(n):
        if(a[i][j]=='1'):
            q.append((0,i,j))
            vis.add((i,j))
            dfs(i,j)
            flag=1
            break
for i in vis:
    x,y=i
    a[x][y]='0'
while(q):
    l,x,y=q.popleft()
    if(a[x][y]=='1'):
        print(l-1)
        break
    for i in range(4):
        xx=x+dx[i]
        yy=y+dy[i]
        if(0<=xx<n and 0<=yy<n and (xx,yy) not in vis):
            vis.add((xx,yy))
            q.append((l+1,xx,yy))
```
# 2025.12.16
## [小游戏](http://cs101.openjudge.cn/practice/02802/)
线段数目
```python
from collections import deque
qwq=0
dx=[0,1,0,-1]
dy=[1,0,-1,0]
while(True):
    w,h=map(int,input().split())
    if(w==0 and h==0):
        break
    qwq+=1
    print("Board #%d:" %qwq)
    a=[]
    a.append(" "*(w+2))
    for i in range(h):
        t=input()
        t=" "+t+" "
        a.append(t)
    a.append(" "*(w+2))
    qaq=0
    while(True):
        y1,x1,y2,x2=map(int,input().split())
        if(x1==0 and y1==0 and x2==0 and y2==0):
            break
        qaq+=1
        q=deque()
        q.append((0,x1,y1,4))
        vis=[[float("inf") for _ in range(w+2)]for _ in range(h+2)]
        vis[x1][y1]=0
        flag=0
        res=float("inf")
        while(q):
            l,x,y,dir=q.popleft()
            if(x==x2 and y==y2):
                flag=1
                res=min(res,l)
            for i in range(4):
                xx=x+dx[i]
                yy=y+dy[i]
                if(0<=xx<=h+1 and 0<=yy<=w+1):
                    if((a[xx][yy]!='X' or (xx==x2 and yy==y2)) and l+1<=res and vis[xx][yy]>=l+1):
                        if(dir==i):
                            q.append((l,xx,yy,i))
                            vis[xx][yy]=l
                        else:
                            q.append((l+1,xx,yy,i))
                            vis[xx][yy]=l+1
        if(flag==0):
            print("Pair %d: impossible." %qaq)
        else:
            print("Pair %d: %d segments." % (qaq,res))
    print()
```
## [01 矩阵](https://leetcode.cn/problems/01-matrix/description/)
所有0加入起点同时开始bfs。搜到一就标记。这样整个表格每个数只会被遍历到一遍。
```python
from collections import deque
from copy import deepcopy
class Solution:
    def updateMatrix(self, mat: list[list[int]]) -> list[list[int]]:
        dx=[0,1,0,-1]
        dy=[1,0,-1,0]
        m=len(mat)
        n=len(mat[0])
        q=deque()
        s=deepcopy(mat)
        vis=[[0 for _ in range(n)]for _ in range(m)]
        for i in range(m):
            for j in range(n):
                if(mat[i][j]==0):
                    q.append((0,i,j))
                    vis[i][j]=1
        while(q):
            l,x,y=q.popleft()
            if(mat[x][y]==1):
                s[x][y]=l
            for i in range(4):
                xx=x+dx[i]
                yy=y+dy[i]
                if(0<=xx<m and 0<=yy<n):
                    if(vis[xx][yy]==0):
                        vis[xx][yy]=1
                        q.append((l+1,xx,yy))
        return s
print(Solution().updateMatrix([[0,0,0],[0,1,0],[1,1,1]]))
```
## [交换字符串中的元素](https://leetcode.cn/problems/smallest-string-with-swaps/description/)
并查集。同一连通块中的字母可以任意交换顺序。
```python
from collections import defaultdict
class Solution:
    def smallestStringWithSwaps(self, s: str, pairs: list[list[int]]) -> str:
        m=len(pairs)
        n=len(s)
        fa=[]
        siz=[]
        for i in range(n):
            fa.append(i)
            siz.append(1)
        def find(x):
            if(x==fa[x]):
                return x
            else:
                fa[x]=find(fa[x])
                return find(fa[x])
        def merge(x,y):
            fx=find(x)
            fy=find(y)
            if(fx==fy):
                return
            if(siz[x]>=siz[y]):
                fa[fy]=fx
                siz[x]+=siz[y]
            else:
                fa[fx]=fy
                siz[y]+=siz[x]
        for i in range(m):
            x,y=pairs[i][0],pairs[i][1]
            merge(x,y)
        d=defaultdict(list)
        p=defaultdict(list)
        res=[" "]*n
        for i in range(n):
            d[find(i)].append(s[i])
            p[find(i)].append(i)
        for i in d.keys():
            d[i].sort()
            p[i].sort()
            for j in range(len(d[i])):
                res[p[i][j]]=d[i][j]
        return "".join(res)
print(Solution().smallestStringWithSwaps("dcab",[[0,3],[1,2]]))
```
## [可以到达的最远建筑](https://leetcode.cn/problems/furthest-building-you-can-reach/description/)
后悔算法。单调队列存高度落差。
```python
import heapq
class Solution:
    def furthestBuilding(self, heights: list[int], bricks: int, ladders: int) -> int:
        n=len(heights)
        ans=0
        h=[]
        for i in range(1,n):
            if(heights[i]<=heights[i-1]):
                ans+=1
            else:
                if(ladders>0):
                    ladders-=1
                    heapq.heappush(h,heights[i]-heights[i-1])
                    ans+=1
                elif(ladders==0 and bricks>0):
                    heapq.heappush(h,heights[i]-heights[i-1])
                    x=heapq.heappop(h)
                    if(bricks>=x):
                        bricks-=x
                        ans+=1
                    else:
                        break
                else:
                    break
        return ans
print(Solution().furthestBuilding([4,2,7,6,9,14,12],5,1))
```
# 2025.12.17
## [幸福的寒假生活](http://cs101.openjudge.cn/pctbook/T23568/)
完全背包。
```python
from collections import defaultdict
def convert(s):
    x,y=map(int,s.split('.'))
    return (x-1)*31+y-7
n=int(input())
dp=[0]*45
# start=[]
# end=[]
# value=[]
date=defaultdict(list)
for i in range(n):
    a,b,c=input().split()
    x=convert(a)
    y=convert(b)
    date[y].append((x,int(c)))
    # start.append(x)
    # end.append(y)
    # value.append(int(c))
for i in range(45):
    dp[i]=dp[i-1]
    if(i in date.keys()):
        for j in range(len(date[i])):
            p,q=date[i][j]
            dp[i]=max(dp[i],dp[p-1]+q)
print(dp[44])
```
## [体育游戏跳房子](http://cs101.openjudge.cn/pctbook/T27237/)
vis可用桶或集合。这边vis包含的数过大，因此用集合。
```python
from collections import deque
while(True):
    n,m=map(int,input().split())
    if(m==0 and n==0):
        break
    q=deque()
    q.append((n,"",0))
    vis=set()
    vis.add(n)
    res=[]
    ans=float("inf")
    while(q):
        cur,path,l=q.popleft()
        if(l>ans):
            break
        if(cur==m):
            ans=l
            res.append(path)
        if((cur*3) not in vis):
            vis.add(cur*3)
            q.append((cur*3,path+"H",l+1))
        if(cur//2>0 and (cur//2) not in vis):
            vis.add(cur//2)
            q.append((cur//2,path+"O",l+1))
    res.sort()
    print(ans)
    print(res[0])
```
## [蛇入迷宫](http://cs101.openjudge.cn/pctbook/M28973/)
```python
from collections import deque
n=int(input())
a=[]
for i in range(n):
    t=list(map(int,input().split()))
    a.append(t)
q=deque()
q.append((0,0,0,0,1))
vis=set()
vis.add((0,0,0,1))
flag=0
while(q):
    l,x1,y1,x2,y2=q.popleft()
    if(x1==n-1 and y1==n-2 and x2==n-1 and y2==n-1):
        flag=1
        print(l)
        break
    if(x1==x2):
        if(0<=x1+1<n and a[x1+1][y1]==0 and a[x2+1][y2]==0):
            if((x1+1,y1,x2+1,y2) not in vis):
                q.append((l+1,x1+1,y1,x2+1,y2))
                vis.add((x1+1,y1,x2+1,y2))
            if((x1,y1,x1+1,y1) not in vis):
                q.append((l+1,x1,y1,x1+1,y1))
                vis.add((x1,y1,x1+1,y1))
        if(0<=y1+1<n and 0<=y2+1<n and a[x1][y1+1]==0 and a[x2][y2+1]==0 and (x1,y1+1,x2,y2+1) not in vis):
            q.append((l+1,x1,y1+1,x2,y2+1))
            vis.add((x1,y1+1,x2,y2+1))
    elif(y1==y2):
        if(0<=y1+1<n and a[x1][y1+1]==0 and a[x2][y2+1]==0):
            if((x1,y1+1,x2,y2+1) not in vis):
                q.append((l+1,x1,y1+1,x2,y2+1))
                vis.add((x1,y1+1,x2,y2+1))
            if((x1,y1,x1,y1+1) not in vis):
                q.append((l+1,x1,y1,x1,y1+1))
                vis.add((x1,y1,x1,y1+1))
        if(0<=x1+1<n and 0<=x2+1<n and a[x1+1][y1]==0 and a[x2+1][y2]==0 and (x1+1,y1,x2+1,y2) not in vis):
            q.append((l+1,x1+1,y1,x2+1,y2))
            vis.add((x1+1,y1,x2+1,y2))
if(flag==0):
    print(-1)
```
## [温度调节](http://cs101.openjudge.cn/pctbook/M28914/)
```python
t=int(input())
for _ in range(t):
    l,r,x=map(int,input().split())
    a,b=map(int,input().split())
    if(a>b):
        a,b=b,a
    if(a==b):
        print(0)
        continue
    elif(abs(a-b)>=x):
        print(1)
        continue
    else:
        if(b-l<x and r-b<x):
            print(-1)
            continue
        elif(r-b>=x):
            print(2)
            continue
        else:
            if(a-l>=x):
                print(2)
                continue
            elif(r-a>=x):
                print(3)
                continue
            else:
                print(-1)
                continue
```
## [买水果](http://cs101.openjudge.cn/pctbook/M28699/)
[python中的字典排序--sorted()](https://blog.csdn.net/gymaisyl/article/details/83039279)
[在 Python 中按值對 defaultdict 進行排序](https://tw.python-3.com/?p=25741)
```python
n,m=map(int,input().split())
a=list(map(int,input().split()))
a.sort()
t={}
for i in range(m):
    s=input()
    if(s in t.keys()):
        t[s]+=1
    else:
        t[s]=1
# p=sorted(t.items(),key=lambda x:x[1],reverse=True)
f=sorted(t.values(),reverse=True)
minm=0
maxm=0
for i in range(len(f)):
    minm+=a[i]*f[i]
a=a[::-1]
for i in range(len(f)):
    maxm+=a[i]*f[i]
print(minm,maxm)
```
## [PASCAL代码](http://cs101.openjudge.cn/practice/28908/)
```python
s=list(input().strip(';').split(';'))
a,b,c=0,0,0
for i in s:
    x,y=i.split(":=")
    if(x=='a'):
        a=int(y)
    elif(x=='b'):
        b=int(y)
    elif(x=='c'):
        c=int(y)
print(a,b,c)
```
## [奖学金](http://cs101.openjudge.cn/pctbook/E28681/)
```python
n=int(input())
a=[]
for i in range(1,n+1):
    x,y,z=map(int,input().split())
    a.append([-(x+y+z),-x,i,y,z])
a.sort()
for i in range(5):
    print(a[i][2],-a[i][0])
```
## [猜数](http://cs101.openjudge.cn/practice/29986/)
```python
import random, time, sys
ans = random.randint(0, 1000)
query = lambda i: 0 if i == ans else (1 if i > ans else -1)
io1 = int(input())
io2 = int(input())
toexpr = lambda x: ' + '.join(f"((lambda: 1)() << ({' + '.join(['(lambda: 1)()'] * i)} + 0))" for i in range(10) if x & (1 << i)) + '+ 0'
cnt = 0
exec(f'''def query(i):
    global cnt
    assert ''.__class__.__class__(''.join) == ''.__class__.__class__(sys.__stdout__.write)
    assert ''.__class__.__class__(''.__eq__) == ''.__class__.__class__(sys.__stdout__.write.__self__.__repr__)
    assert sys.__stdout__.write.__self__.__repr__() == "<_io.TextIOWrapper name='<stdout>' mode='w' encoding='utf-8'>"
    sys.__stdout__.write(''.__class__({toexpr(io1)}) + (10).to_bytes(1, 'big').decode())
    assert ''.__class__.__class__(i) == (0).__class__
    assert 0 <= i <= 1000
    assert ''.__class__.__class__(cnt) == (0).__class__
    assert cnt < 15
    cnt += 1
    if i == {toexpr(ans)}:
        while cnt < 15:
            cnt += 1
            sys.__stdout__.write(''.__class__({toexpr(io1)}) + (10).to_bytes(1, 'big').decode())
        sys.__stdout__.write(''.__class__({toexpr(io2)}))
        return 0
    return 1 if i > {toexpr(ans)} else -1''')
time.sleep(random.random() * 0.05)
random.seed(0)
del ans, io1, io2

#CODE BELOW HERE
l=0
r=1000
while(True):
    mid=(l+r)//2
    t=query(mid)
    if(t==0):
        break
    elif (t == 1):
        r = mid - 1
    elif (t == -1):
        l = mid + 1
```
hack交互库这一块 **from FuYn**
```python
import random, time, sys
ans = random.randint(0, 1000)
query = lambda i: 0 if i == ans else (1 if i > ans else -1)
io1 = int(input())
io2 = int(input())
toexpr = lambda x: ' + '.join(f"((lambda: 1)() << ({' + '.join(['(lambda: 1)()'] * i)} + 0))" for i in range(10) if x & (1 << i)) + '+ 0'
cnt = 0
exec(f'''def query(i):
    global cnt
    assert ''.__class__.__class__(''.join) == ''.__class__.__class__(sys.__stdout__.write)
    assert ''.__class__.__class__(''.__eq__) == ''.__class__.__class__(sys.__stdout__.write.__self__.__repr__)
    assert sys.__stdout__.write.__self__.__repr__() == "<_io.TextIOWrapper name='<stdout>' mode='w' encoding='utf-8'>"
    sys.__stdout__.write(''.__class__({toexpr(io1)}) + (10).to_bytes(1, 'big').decode())
    assert ''.__class__.__class__(i) == (0).__class__
    assert 0 <= i <= 1000
    assert ''.__class__.__class__(cnt) == (0).__class__
    assert cnt < 15
    cnt += 1
    if i == {toexpr(ans)}:
        while cnt < 15:
            cnt += 1
            sys.__stdout__.write(''.__class__({toexpr(io1)}) + (10).to_bytes(1, 'big').decode())
        sys.__stdout__.write(''.__class__({toexpr(io2)}))
        return 0
    return 1 if i > {toexpr(ans)} else -1''')
time.sleep(random.random() * 0.05)
random.seed(0)
del ans, io1, io2
import os
original_stdout_fd=os.dup(1)
devnull =os.open(os.devnull,os.O_WRONLY)
os.dup2(devnull,1)
found =-1
for i in range(1001):
    cnt =0
    if query(i)==0:
        found = i
        break
sys.__stdout__.flush()
os.dup2(original_stdout_fd,1)
os.close(devnull)
os.close(original_stdout_fd)
cnt =0
query(found)
```
```python
import random, time, sys
ans = random.randint(0, 1000)
query = lambda i: 0 if i == ans else (1 if i > ans else -1)
io1 = int(input())
io2 = int(input())
toexpr = lambda x: ' + '.join(f"((lambda: 1)() << ({' + '.join(['(lambda: 1)()'] * i)} + 0))" for i in range(10) if x & (1 << i)) + '+ 0'
cnt = 0
exec(f'''def query(i):
    global cnt
    assert ''.__class__.__class__(''.join) == ''.__class__.__class__(sys.__stdout__.write)
    assert ''.__class__.__class__(''.__eq__) == ''.__class__.__class__(sys.__stdout__.write.__self__.__repr__)
    assert sys.__stdout__.write.__self__.__repr__() == "<_io.TextIOWrapper name='<stdout>' mode='w' encoding='utf-8'>"
    sys.__stdout__.write(''.__class__({toexpr(io1)}) + (10).to_bytes(1, 'big').decode())
    assert ''.__class__.__class__(i) == (0).__class__
    assert 0 <= i <= 1000
    assert ''.__class__.__class__(cnt) == (0).__class__
    assert cnt < 15
    cnt += 1
    if i == {toexpr(ans)}:
        while cnt < 15:
            cnt += 1
            sys.__stdout__.write(''.__class__({toexpr(io1)}) + (10).to_bytes(1, 'big').decode())
        sys.__stdout__.write(''.__class__({toexpr(io2)}))
        return 0
    return 1 if i > {toexpr(ans)} else -1''')
time.sleep(random.random() * 0.05)
random.seed(0)
del ans, io1, io2
import dis
co =query.__code__
code_bytes =bytearray(co.co_code)
COMPARE_OP = dis.opmap['COMPARE_OP']
found =0
for i in range(0,len(code_bytes),2):
    opcode =code_bytes[i]
    arg = code_bytes[i + 1]
    if opcode ==COMPARE_OP and arg == 2:
        found +=1
        if found == 6:
            code_bytes[i+1]=3
            break
if found ==6:
    query.__code__=co.replace(co_code=bytes(code_bytes))
    if query(0)!= 0:
        query(1)
```
## [前缀单词](http://cs101.openjudge.cn/practice/27372/)
先暴力求解单词两两之间是否为前缀。然后注意到把这些字符串排序后，对于任意一组j<i且他们不互为前缀，若对于任意一组k<j且他们不互为前缀，则k与i不互为前缀。
因此需要对字符串排序。dp数组记录前i个单词中包括第i个的子集的数目，可以由j<i转移过来。
```python
n=int(input())
a=[[1 for _ in range(n)]for _ in range(n)]
words=[]
dp=[1]*n
for i in range(n):
    t=input()
    words.append(t)
words.sort()
for i in range(n):
    a[i][i]=0
    for j in range(i+1,n):
        x=words[i]
        y=words[j]
        if(len(x)>len(y)):
            if(x[0:len(y)]==y):
                a[i][j]=a[j][i]=0
        elif(len(x)<len(y)):
            if(y[0:len(x)]==x):
                a[i][j]=a[j][i]=0
for i in range(n):
    for j in range(i):
        if(a[i][j]==1):
            dp[i]+=dp[j]
print(sum(dp)+1)
```
# 2025.12.18
## [月度开销](http://cs101.openjudge.cn/20251218mockexam/M04135/)
二分答案
```python
n,m=map(int,input().split())
a=[]
for i in range(n):
    t=int(input())
    a.append(t)
l=max(a)
r=sum(a)
ans=0
while(l<=r):
    mid=(l+r)//2
    t=1
    cur=0
    for i in range(n):
        cur+=a[i]
        if(cur>mid):
            t+=1
            cur=a[i]
    if(t>m):
        l=mid+1
    else:
        ans=mid
        r=mid-1
print(ans)
```
## [接雨水](http://cs101.openjudge.cn/20251218mockexam/T26977/)
单调栈。建立一个单调递减的栈，当当前元素高于栈顶时就弹出，并计算当前元素与新栈顶之间的雨水，(i-left-1)*(min(a[left],a[i])-a[q])
```python
from collections import deque
n=int(input())
a=list(map(int,input().split()))
t=deque()
ans=0
for i in range(n):
    if(len(t)==0):
        t.append(i)
    else:
        while(len(t)>0 and a[t[-1]]<a[i]):
            q=t.pop()
            if(len(t)==0):
                break(i-left-1)*(min(a[left],a[i])-a[q])
                
            left=t[-1]
            ans+=(i-left-1)*(min(a[left],a[i])-a[q])
        t.append(i)
print(ans)
```
## [二进制问题](http://cs101.openjudge.cn/20251218mockexam/T30212/)
考虑直接计算。
![image](https://img2024.cnblogs.com/blog/2669443/202512/2669443-20251221152136947-382248645.png)
```python
from math import comb
n,k=map(int,input().split())
a=bin(n)[2:]
t=len(a)
ans=0
cnt=0
if(a.count('1')==k):
    ans=1
for i in range(t):
    if(a[i]=='1'):
        cnt+=1
        if(k-cnt+1>t-i-1):
            break
        if(k-cnt+1<0):
            break
        ans+=comb(t-i-1,k-cnt+1)
print(ans)
```
# 2025.12.21
## [P8764 [蓝桥杯 2021 国 BC] 二进制问题](https://www.luogu.com.cn/problem/P8764)
数位dp.
```python
n,k=map(int,input().split())
dp=[[[0 for _ in range(2)]for _ in range(72)]for _ in range(72)]#首位为t，含有j个1的i位数个数
dp[1][1][1]=1
dp[1][0][0]=1
for i in range(2,72):
    for j in range(i+1):
        if(j>0):
            dp[i][j][1]=dp[i-1][j-1][1]+dp[i-1][j-1][0]
        dp[i][j][0]=dp[i-1][j][0]+dp[i-1][j][1]
n2=bin(n)[2:]
l=len(n2)
ans=0
qaq=0
for i in range(l):
    if(n2[i]=='1'):
        qaq+=1
if(qaq==k):
    ans=1
for i in range(k,l):
    ans+=dp[i][k][1]
t=1
for i in range(1,l):
    if(t>k):
        break
    if(n2[i]=='1'):
        ans+=dp[l-i][k-t][0]
        t+=1
print(ans)
```
# 2025.12.22
## [愉悦的假期](http://cs101.openjudge.cn/practice/30339/)
0-1BFS。从每个岛向全图搜索，记录每个点到三个岛的最短距离。当当前路径大小更小时更新并加入队列。
```python
from collections import deque
n,m=map(int,input().split())
dx=[0,1,0,-1]
dy=[1,0,-1,0]
a=[]
for i in range(n):
    t=input()
    a.append(t)
t=[[0 for _ in range(m)]for _ in range(n)]
def dfs(x,y,mark):
    for i in range(4):
        xx=x+dx[i]
        yy=y+dy[i]
        if(0<=xx<n and 0<=yy<m):
            if(t[xx][yy]==0 and a[xx][yy]=='X'):
                t[xx][yy]=mark
                dfs(xx,yy,mark)
cnt=0
for i in range(n):
    for j in range(m):
        if(a[i][j]=='X' and t[i][j]==0):
            cnt+=1
            t[i][j]=cnt
            dfs(i,j,cnt)
ans=float("inf")
res=[[[float("inf") for _ in range(4)]for _ in range(m)]for _ in range(n)]
def bfs(x):
    q=deque()
    #vis=set()
    for i in range(n):
        for j in range(m):
            if(t[i][j]==x):
                q.append((0,i,j))
                #vis.add((i,j))
                res[i][j][x]=0
    while(q):
        l,i,j=q.popleft()
        for k in range(4):
            xx=i+dx[k]
            yy=j+dy[k]
            if(0<=xx<n and 0<=yy<m):
                #vis.add((xx,yy))
                if(a[xx][yy]=='X'):
                    weight=0
                else:
                    weight=1
                if(l+weight<res[xx][yy][x]):
                    res[xx][yy][x]=l+weight
                    if(weight==0):
                        q.appendleft((l,xx,yy))
                    else:
                        q.append((l+1,xx,yy))
for i in range(1,4):
    bfs(i)
ans=float("inf")
for i in range(n):
    for j in range(m):
        t=res[i][j][1]+res[i][j][2]+res[i][j][3]
        if(a[i][j]=='.'):
            t-=2
        ans=min(ans,t)
print(ans)
```
## [善良的助教](http://cs101.openjudge.cn/practice/30370/)
```python
n=int(input())
a=list(map(int,input().split()))
ans=0
a.sort()
if(a[n-1]<n):
    ans+=1
if(a[0]>0):
    ans+=1
for i in range(1,n):
    if(i>a[i-1] and i<a[i]):
        ans+=1
print(ans)
```
## [核电站](http://cs101.openjudge.cn/pctbook/T09267/)
```python
n,m=map(int,input().split())
dp=[0]*(n+1)
dp[0]=1
dp[1]=2
for i in range(2,n+1):
    if(i<m):
        dp[i]=2*dp[i-1]
    elif(i==m):
        dp[i]=2*dp[i-1]-1
    else:
        dp[i]=2*dp[i-1]-dp[i-m-1]#炸：第i位放了，且前面m-1位都放了
print(dp[n])
```
## [宠物小精灵之收服](http://cs101.openjudge.cn/practice/04102/)
二位费用01背包。
```python
n,m,k=map(int,input().split())
w=[]
h=[]
for i in range(k):
    x,y=map(int,input().split())
    w.append(x)
    h.append(y)
dp=[[-1 for _ in range(m+1)]for _ in range(k+1)]#i只精灵，j体力，精灵球数量
dp[0][m]=n
for i in range(k):
    for p in range(i,-1,-1):
        for j in range(m - h[i], 0, -1):
            #if(dp[p][j+h[i]]>=w[i]):
            dp[p+1][j]=max(dp[p+1][j],dp[p][j+h[i]]-w[i])
ans=0
res=0
# for i in range(k+1):
#     print(dp[i])
flag=0
for i in range(k,-1,-1):
    for j in range(m,0,-1):
        if(dp[i][j]>=0):
            ans=i
            res=j
            flag=1
            break
    if(flag==1):
        break
print(ans,res)
```
## [小蓝和小桥](http://cs101.openjudge.cn/practice/29853/)
构建差值矩阵，先手删列后手删行。因此结果一定是每一列最大值中的最小值。
```python
n=int(input())
a=list(map(int,input().split()))
b=list(map(int,input().split()))
minb=min(b)
maxb=max(b)
ans=float("inf")
for i in range(n):
    ans=min(ans,max(abs(a[i]-minb),abs(a[i]-maxb)))
print(ans)
```
## [Arena of Greed](https://codeforces.com/problemset/problem/1425/A)
让对手+1>让自己加一半
```python
def change(x):
    if(x==1):
        return 0
    if(x==4):
        return 2
    if(x%2==1):
        return x-1
    elif(x%4==2):
        return x//2
    else:
        return x-1
t=int(input())
for _ in range(t):
    a=int(input())
    ans=0
    flag=1
    while(a):
        qaq=change(a)
        if(flag==1):
            ans+=a-qaq
        a=qaq
        flag=-flag
    print(ans)
```
## [独特蘑菇](https://sunnywhy.com/problem/10065)
滑动窗口。r一个个往右加，l往右缩。某一段合法区间对答案的贡献是l-r+1.
```python
from collections import defaultdict
n,k=map(int,input().split())
c=list(map(int,input().split()))
f=defaultdict(int)
ans=0
l=0
for r in range(n):
    if(c[r] not in f):
        f[c[r]]=1
    else:
        f[c[r]]+=1
    while(len(f)>k):
        f[c[l]]-=1
        if(f[c[l]]==0):
           del f[c[l]]
        l+=1
    ans+=(r-l+1)
print(ans)
```
## [滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/description/)
```python
from collections import deque
class Solution:
    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:
        n=len(nums)
        q=deque()
        ans=[]
        for i in range(k):
            while(q and nums[i]>=nums[q[-1]]):
                q.pop()
            q.append(i)
        ans.append(nums[q[0]])
        for i in range(k,n):
            while(q and nums[i]>=nums[q[-1]]):
                q.pop()
            q.append(i)
            while(q[0]<=i-k):
                q.popleft()
            ans.append(nums[q[0]])
        return ans
print(Solution().maxSlidingWindow([1,3,-1,-3,5,3,6,7],3))
```
## [双生](http://cs101.openjudge.cn/practice/30044/)
筛法。
```python
from math import sqrt
p=[True]*65537
def is_prime(x):
    for i in range(2,int(sqrt(x))+1):
        if(x%i==0):
            return  False
    return True
p[0]=p[1]=False
for i in range(2,256):
    if(is_prime(i)):
        for j in range(i*i,65537,i):
            p[j]=False
vis=[False]*65537
res=[]
for i in range(3,65537):
    if(p[i]):
        t=int(bin(i)[2:][::-1],2)
        if(p[t] and not vis[i] and not vis[t]):
            res.append((i,t))
            vis[i]=True
            vis[t]=True
a=int(input())
x,y=res[a]
print(x,y)
```
## [不降数组数量](http://cs101.openjudge.cn/practice/30041/)
dp滚动数组+bisect+前缀和。
```python
from bisect import bisect_right
n,m=map(int,input().split())
a=[]
for i in range(n):
    t=list(map(int,input().split()))
    a.append(t)
dp=[1 for _ in range(m)]
pre=[0 for _ in range(m)]
for i in range(1,n):
    pre[0]=dp[0]
    for j in range(1,m):
        pre[j]=pre[j-1]+dp[j]
    for j in range(m):
        t=bisect_right(a[i-1],a[i][j])
        if(t>0):
            dp[j]=pre[t-1]
        else:
            dp[j]=0
print(sum(dp))
```
## [坐地铁](http://cs101.openjudge.cn/practice/30022/)
```python
from collections import deque
n,k,s=map(int,input().split())
a=[]
for i in range(n):
    t=list(map(int,input().split()))
    a.append(t)
s1=[float("inf")]*n
s2=[float("inf")]*n
q=deque()
q.append((0,k))
vis=set()
vis.add(k)
s1[k]=0
while(q):
    l,cur=q.popleft()
    s1[cur]=l
    for i in range(n):
        if(a[cur][i]==1 and i not in vis):
            q.append((l+1,i))
            vis.add(i)
q=deque()
q.append((0,s))
vis=set()
vis.add(s)
s2[s]=0
while(q):
    l,cur=q.popleft()
    s2[cur]=l
    for i in range(n):
        if(a[cur][i]==1 and i not in vis):
            q.append((l+1,i))
            vis.add(i)
ans=float("inf")
for i in range(n):
    if(s1[i]==s2[i]):
        ans=min(ans,s1[i])
if(ans==float("inf")):
    ans=-1
print(ans)
```
## [化学分子式](https://www.luogu.com.cn/problem/P2382)
记录当前在栈的哪一层。碰到左括号层数加一，碰到右括号则将当前层数值乘以倍数并加入下一层，清空这一层。
```python
from collections import defaultdict
chem=defaultdict(int)
while(True):
    t=input().strip()
    if(t=="END_OF_FIRST_PART"):
        break
    a,b=t.split()
    chem[a]=int(b)
while(True):
    s=input().strip()
    if(s=='0'):
        break
    n=len(s)
    res=[0]*n
    key=0
    num=0
    flag=1
    i=0
    while(i<n):
        if('A'<=s[i]<='Z'):
            if(i+1<n and 'a'<=s[i+1]<='z'):
                if(s[i]+s[i+1] in chem):
                    num=chem[s[i]+s[i+1]]
                    res[key]+=num
                    i+=2
                else:
                    flag=0
                    break
            else:
                if(s[i] in chem):
                    num=chem[s[i]]
                    res[key]+=num
                    i+=1
                else:
                    flag=0
                    break
        elif('0'<=s[i]<='9'):
            tot=""
            while(i<n and '0'<=s[i]<='9'):
                tot+=s[i]
                i+=1
            res[key]+=num*(int(tot)-1)
        elif(s[i]=='('):
            key+=1
            i+=1
        elif(s[i]==')'):
            i+=1
            tot=""
            while(i<n and '0'<=s[i]<='9'):
                tot+=s[i]
                i+=1
            res[key]*=int(tot)
            res[key-1]+=res[key]
            res[key]=0
            key-=1
    if(flag==0):
        print("UNKNOWN")
    else:
        print(res[0])
```
# 2025.12.23
## [候选人追踪](http://cs101.openjudge.cn/pctbook/T27384/)
双堆+懒删除。开两个堆分别记录目标中的最小值和非目标中的最大值，等pop的时候判断是否为旧数据再删除。注意特判k=m的情况，此时大根堆应始终返回-1而不是0.
```python
import heapq
n,k=map(int,input().split())
qaq=list(map(int,input().split()))
s=list(map(int,input().split()))
votes=[]
for i in range(n):
    votes.append([qaq[2*i],qaq[2*i+1]])
votes=sorted(votes,key=lambda x:x[0])
win=[]
lose=[]
cand=set(s)
m=314159
cnt=[0]*(m+1)
for i in range(k):
    heapq.heappush(win,(0,s[i]))
cur=0
lst=0
ans=0
def get_min():
    while(win):
        num,id=win[0]
        if(cnt[id]==num):
            return num
        heapq.heappop(win)
    return 0
def get_max():
    while(lose):
        num,id=lose[0]
        if(cnt[id]==-num):
            return -num
        heapq.heappop(lose)
    if(k==m):
        return -1
    else:
        return 0
for i in range(n):
    cur=votes[i][0]
    win0=get_min()
    lose0=get_max()
    if(win0>lose0):
        ans+=(cur-lst)
    lst=cur
    idx=votes[i][1]
    cnt[idx]+=1
    if(idx in cand):
        heapq.heappush(win,(cnt[idx],idx))
    else:
        heapq.heappush(lose,(-cnt[idx],idx))
print(ans)
```
