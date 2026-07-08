---
title: CF Hello 2026
description: CS101期末考试
publishedAt: 2026-01-08
tags:
  - 算法
  - Python
---
没怎么打，把简单题写了
## [Binary Array Game](https://codeforces.com/contest/2183/problem/A)
如果有一整段把所有0都包进去，Alice可以把它变成1.如果数列随后变成了11那么Alice就赢了。如果不行，那么数列不能变成全为1的形式，Bob就可以把整个数列变为1.因此只需判断头尾是否同为0即可。
```python
t=int(input())
for _ in range(t):
    n=int(input())
    a=list(map(int,input().split()))
    if(a[0]==0 and a[n-1]==0):
        print("Bob")
    else:
        print("Alice")
```
## [Yet Another MEX Problem](https://codeforces.com/contest/2183/problem/B)
一段区间中把小数换成大数一定会让MEX更高。而最终k-1个数的mex最大是k-1，因此可以先把比k-1大的都删了，再把重复的都删了。最终效果就是看整个区间小于k的所有数的mex。
```python
t=int(input())
for _ in range(t):
    n,k=map(int,input().split())
    a=list(map(int,input().split()))
    t=set(a)
    ans=k-1
    for i in range(k-1):
        if(i not in t):
            ans=i
            break
    print(ans)
```
## [War Strategy](https://codeforces.com/contest/2183/problem/C)
赛时O(n)做法。向两边扩展，最优策略是先屯兵，然后一次性打到较长的那一边，再直接打到较短的那一边（走完较长边的时间中已经屯好了走完较短边所需士兵）。因此直接枚举较长边长度即可。
优化考虑二分。O(logn)
```python
from math import ceil
t=int(input())
for _ in range(t):
    n,m,k=map(int,input().split())
    ans=1
    t1=k-1
    t2=n-k
    a=min(t1,t2)
    b=max(t1,t2)
    for i in range(b,-1,-1):
        if(m-(2*i-1)<0):
            continue
        t=min(m-(2*i-1),a)
        if(t>i):
            break
        ans=max(ans,1+i+t)
    print(ans)
```