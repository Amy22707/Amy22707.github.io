---
title: 25fall做题记录 - October
description: 2025.10做题记录及10月计概月考
publishedAt: 2025-10-05
tags:
  - 算法
  - Python
---
# 2025.10.5
## [Sale](https://codeforces.com/contest/34/problem/B)
```python
n,m=map(int,input().split())
a=list(map(int,input().split()))
a.sort()
s=0
for i in range(len(a)):
    if(a[i]<0 and i+1<=m):
        s-=a[i]
    if(a[i]>=0):
        break
print(s)
```
## [Maya Calendar](http://cs101.openjudge.cn/practice/01008/)
这题很难评。注意整除的时候的特殊处理，0->13，年数整除260时会多出来一年。
```python
n=int(input())
print(n)
dic_month={"pop":0,"no":1,"zip":2,"zotz":3,"tzec":4,"xul":5,"yoxkin":6,"mol":7,"chen":8,"yax":9,"zac":10,"ceh":11,"mac":12,"kankin":13,"muan":14,"pax":15,"koyab":16,"cumhu":17,"uayet":18}
name=["ahau","imix","ik","akbal","kan","chicchan","cimi","manik","lamat","muluk","ok","chuen","eb","ben","ix","mem","cib","caban","eznab","canac"]
for i in range(n):
    day,s=input().split('.')
    day=int(day)
    s=s.strip()
    month,year=s.split()
    year=int(year)
    res=year*365+dic_month[month]*20+day+1
    a=res%13
    if(a==0):
        a=13
    c=res//260
    if(res%260==0):
        c-=1
    print("%d %s %d" %(a,name[res%20],c))
```
# 2025.10.6
## [黑神话·悟空](http://cs101.openjudge.cn/practice/29886/)
状压dp。用17位二进制数存储是否已打败怪兽。dp数组记录打败某些怪兽所需的最少次数。复杂度为$O(n*2^n)$.
bit_count()用oj过不了。直接用bin().count()计算二进制中1的个数。
```python
a=list(map(int,input().split()))
n=len(a)
MAXM=float("inf")
dp=[MAXM for _ in range(1<<n)]#打掉bitmask中所有boss所需最少任务数
dp[0]=0
for i in range(1<<n):
    gain=bin(i).count('1')+1
    for j in range(n):
        if(not (i>>j)&1):
            t=i|(1<<j)
            dp[t]=min(dp[t],dp[i]+(a[j]+gain-1)//gain)
print(dp[(1<<n)-1])
```
## [移动零](https://leetcode.cn/problems/move-zeroes/description/)
双指针。维护第一个零的位置。
```python
class Solution:
    def moveZeroes(self, nums: list[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        i0=0
        for i in range(len(nums)):
            if(nums[i]!=0):
                nums[i0],nums[i]=nums[i],nums[i0]
                i0+=1
        return nums
print(Solution().moveZeroes([0,1,0,3,12]))
print(Solution().moveZeroes([0]))
```
## [Dragons](https://codeforces.com/contest/230/problem/A)
贪心+二维数组排序。注意看清题意，大于还是大于等于。
[Python lambda（匿名函数）](https://www.runoob.com/python3/python-lambda.html)
```python
s,n=map(int,input().split())
a=[]
for i in range(n):
    t=list(map(int,input().split()))
    a.append(t)
a=sorted(a,key=lambda t:t[0])
cur=s
flag=1
for i in range(n):
    if(cur>a[i][0]):
        cur+=a[i][1]
    else:
        flag=0
        break
if(flag==0):
    print("NO")
else:
    print("YES")
```
## [搜索插入位置](https://leetcode.cn/problems/search-insert-position/description/)
二分查找。
```python
class Solution:
    def searchInsert(self, nums: list[int], target: int) -> int:
        left=0
        right=len(nums)-1
        while(left<=right):
            mid=(left+right)//2
            if(nums[mid]>=target):
                right=mid-1
            else:
                left=mid+1
        return left

print(Solution().searchInsert([1,3,5,6],5))
print(Solution().searchInsert([1,3,5,6],2))
print(Solution().searchInsert([1,3,5,6],7))
print(Solution().searchInsert([1,3,5,6],0))
```
## [Xenia and Ringroad](https://codeforces.com/problemset/problem/339/B)
```python
n,m=map(int,input().split())
a=list(map(int,input().split()))
cur=1
ans=0
for i in range(m):
    if(cur<=a[i]):
        ans+=a[i]-cur
        cur=a[i]
    else:
        ans+=n-cur+a[i]
        cur=a[i]
print(ans)
```
## [多项式时间复杂度](http://cs101.openjudge.cn/pctbook/E23563/)
特判0n和n.
```python
a=list(input().strip().split('+'))
ans=0
for i in range(len(a)):
    if('n' in a[i]):
        x,y=a[i].split('n^')
        if(x!='0'):
            ans=max(ans,int(y))
print("n^%d" %(ans))
```
## [Equation](https://codeforces.com/problemset/problem/20/B)
```python
from math import sqrt
a,b,c=map(int,input().split())
if(a==0):
    if(b==0):
        if(c==0):
            print(-1)
        elif(c!=0):
            print(0)
    elif(b!=0):
        print(1)
        print("%.5f" %(-c/b))
else:
    d=b*b-4*a*c
    if(d<0):
        print(0)
    elif(d==0):
        print(1)
        print("%.5f" %((-b)/(2*a)))
    else:
        print(2)
        x=(-b+sqrt(d))/(2*a)
        y=(-b-sqrt(d))/(2*a)
        if(x>y):
            x,y=y,x
        print("%.5f\n%.5f" %(x,y))
```
## [Holiday Hotel](http://cs101.openjudge.cn/practice/02783/)
```python
while(True):
    n=int(input())
    if(n==0):
        break
    a=[]
    for i in range(n):
        t=list(map(int,input().split()))
        a.append(t)
    a=sorted(a,key=lambda t:(t[0],t[1]))
    minm=a[0][1]
    ans=1
    for i in range(1,n):
        if(a[i][1]<minm):
            minm=a[i][1]
            ans+=1
    print(ans)
```
## [菲波那契数列](http://cs101.openjudge.cn/pctbook/E02753/)
```python
a=[0,1,1]
idx=2
for i in range(25):
    a.append(a[idx-1]+a[idx])
    idx+=1
n=int(input())
for i in range(n):
    print(a[int(input())])
```
## [Ilya and Queries](https://codeforces.com/contest/313/problem/B)
前缀和。一开始写的位运算但是被首位0击败了。
```python
s=input()
cal=0
pre=[]
for i in range(len(s)-1):
    if(s[i]==s[i+1]):
        cal+=1
    pre.append(cal)
pre.append(cal)
m=int(input())
for i in range(m):
    l0,r0=map(int,input().split())
    if(l0==1):
        print(pre[r0-2])
    else:
        print(pre[r0-2]-pre[l0-2])
```
## [Pasha and Pixels](https://codeforces.com/contest/508/problem/A)
```python
n,m,k=map(int,input().split())
a=[[0 for _ in range(m+2)] for _ in range(n+2)]
ans=0
def check(i,j):
    if(a[i-1][j-1]==1 and a[i-1][j]==1 and a[i][j-1]==1):
        return True
    if(a[i-1][j]==1 and a[i-1][j+1]==1 and a[i][j+1]==1):
        return True
    if(a[i][j-1]==1 and a[i+1][j-1]==1 and a[i+1][j]==1):
        return True
    if(a[i][j+1]==1 and a[i+1][j]==1 and a[i+1][j+1]==1):
        return True
    return False
for i in range(1,k+1):
    x,y=map(int,input().split())
    if(ans!=0):
        continue
    a[x][y]=1
    if(check(x,y)):
        ans=i
print(ans)
```
# 2025.10.8
## [矩阵运算(先乘再加)](http://cs101.openjudge.cn/pctbook/E18161/)
```python
m1,n1=map(int,input().split())
a=[]
for i in range(m1):
    t=list(map(int,input().split()))
    a.append(t)
m2,n2=map(int,input().split())
b=[]
for i in range(m2):
    t=list(map(int,input().split()))
    b.append(t)
m3,n3=map(int,input().split())
c=[]
for i in range(m3):
    t=list(map(int,input().split()))
    c.append(t)
if(n1!=m2 or m1!=m3 or n2!=n3):
    print("Error!")
else:
    m=m1
    n=n1
    p=n2
    for i in range(m):
        for j in range(p):
            for k in range(n):
                c[i][j]+=a[i][k]*b[k][j]
            c[i][j]=str(c[i][j])
    for i in range(m):
        print(" ".join(c[i]))
```
## [二维矩阵上的卷积运算](http://cs101.openjudge.cn/pctbook/E19942/)
```python
m,n,p,q=map(int,input().split())
a=[]
b=[]
c=[[0 for _ in range(n+1-q)]for _ in range(m+1-p)]
for i in range(m):
    t=list(map(int,input().split()))
    a.append(t)
for i in range(p):
    t=list(map(int,input().split()))
    b.append(t)
for i in range(m+1-p):
    for j in range(n+1-q):
        for k in range(p):
            for l in range(q):
                c[i][j]+=b[k][l]*a[i+k][j+l]
        c[i][j]=str(c[i][j])
for i in range(m+1-p):
    print(" ".join(c[i]))
```
## [BerSU Ball](https://codeforces.com/problemset/problem/489/B)
贪心+双指针。cf别惦记你那算法标签了。
![7b68c10d6cc382b72eb7b825a8e75617](https://img2024.cnblogs.com/blog/2669443/202510/2669443-20251008220348221-328307372.png)
```python
n=int(input())
a=list(map(int,input().split()))
m=int(input())
b=list(map(int,input().split()))
a.sort()
b.sort()
i=0
j=0
ans=0
while(i<n and j<m):
    if(abs(a[i]-b[j])<=1):
        ans+=1
        i+=1
        j+=1
    elif(a[i]<b[j]):
        i+=1
    elif(a[i]>b[j]):
        j+=1
print(ans)
```
# 2025.10.9 月考+练习
忘记比赛有罚时了。摆烂过头加生理期导致完全小丑。
这次月考算是对自己的警示。还是有很多很多东西不会的，要抓紧学。
## [分解因数](http://cs101.openjudge.cn/20251009mockexam/E29895/)
**从小到大筛需要的次数更少且用时更短。**
罚时+1.
```python
from math import sqrt
n=int(input())
for i in range(2,int(sqrt(n))+1):
    if(n%i==0):
        print(int(n/i))
        break
```
## [机器猫斗恶龙](http://cs101.openjudge.cn/20251009mockexam/E29940/)
前缀和。
```python
n=int(input())
a=list(map(int,input().split()))
pre=[]
pre.append(a[0])
for i in range(1,n):
    pre.append(pre[i-1]+a[i])
minn=min(pre)
if(minn>0):
    print(0)
else:
    print(-minn+1)
```
## [牛顿迭代法](http://cs101.openjudge.cn/20251009mockexam/M29917/)
注意审题，输入为浮点数而非整数。
罚时+1.
```python
def op(x,a):
    return x-(x*x-a)/(2*x)
while(True):
    try:
        n=float(input())
    except EOFError:
        break
    t=1
    ans=1
    while(abs(op(t,n)-t)>0.000001):
        ans+=1
        t=op(t,n)
    print("%d %0.2f"%(ans,t))
```
## [贪婪的哥布林](http://cs101.openjudge.cn/20251009mockexam/M29949/)
```python
n,m=map(int,input().split())
a=[]
for i in range(n):
    x,y=map(int,input().split())
    t=[x/y,x,y]
    a.append(t)
a=sorted(a,key=lambda t:-t[0])
ans=0
for i in range(len(a)):
    if(a[i][2]<=m):
        m-=a[i][2]
        ans+=a[i][1]
    elif(0<m<a[i][2]):
        ans+=a[i][0]*m
        m=0
    else:
        break
print("%.2f"%(ans))
```
## [求亲和数](http://cs101.openjudge.cn/20251009mockexam/M29918/)
本地跑得飞快然后上去超时了。遂打表。
```python
from math import sqrt
def doit(x):
    sum=1
    for i in range(2,int(sqrt(x))):
        if(x%i==0):
            sum=sum+i+x/i
    return sum
res1=[]
res2=[]
check=[0]*100005
n=int(input())
for i in range(220,n+1):
    if(check[i]==1):
        continue
    t=int(doit(i))
    if(t>n):
        continue
    if(doit(t)==i and t!=i):
        check[i]=1
        check[t]=1
        res1.append(i)
        res2.append(t)
for i in range(len(res1)):
    print(res1[i],res2[i])
```
```python
a=[[220,284],[1184,1210],[2620,2924],[5020,5564],[6232,6368],[10744,10856],[12285,14595],[17296,18416],[63020,76084],[66928,66992],[67095,71145],[69615,87633],[79750,88730]]
n=int(input())
for i in range(13):
    if(a[i][0]<=n and a[i][1]<=n):
        print(a[i][0],a[i][1])
```
## [校门外的树又来了](http://cs101.openjudge.cn/20251009mockexam/T29947/)
最红温的一集。忘记<mark>区间合并</mark>可以贪心，先排序然后比较末端就行了。然后开始各种假。一边输入一边合并，没有考虑修改好的会对原先的产生影响。一边查一边原地删相当混乱。
头铁交了12发然后罚时2h。出来脑袋嗡嗡的。
```python
a=[]
l,m=map(int,input().split())
sum=0
for i in range(m):
    x,y=map(int,input().split())
    a.append([x,y])
ans=l+1
res=[]
a=sorted(a,key=lambda t:t[0])
res.append(a[0])
idx=0
for i in range(1,len(a)):
    if(a[i][0]>a[idx][1]):
        res.append(a[i])
        idx+=1
    else:
        a[idx][1]=max(a[idx][1],a[i][1])
for i in range(len(res)):
    ans-=(res[i][1]-res[i][0]+1)
print(ans)
```
## [Two Divisors](https://codeforces.com/problemset/problem/1366/D)
欧拉筛求最小质因数。只用开一个列表，[]xmaxn比[range]占用空间小。
```python
from math import sqrt
n=int(input())
a=list(map(int,input().split()))
b=[]
c=[]
primes=[]
MAXA=max(a)+1
#sieve_of_euler
div=[0]*MAXA
for i in range(2,MAXA):
    if(div[i]==0):
        div[i]=i
        primes.append(i)
    for j in primes:
        if(j*i>=MAXA):
            break
        div[j*i]=j
        if(i%j==0):
            break
for i in range(n):
    q=div[a[i]]
    t=a[i]
    while(t%q==0):
        t/=q
    if(t!=1):
        b.append(str(int(t)))
        c.append(str(int(a[i]/t)))
    else:
        b.append("-1")
        c.append("-1")
print(" ".join(b))
print(" ".join(c))
```
## [公共前缀](https://sunnywhy.com/sfbj/3/6/83)
```python
n=int(input())
a=[]
lent=55
for i in range(n):
    t=input()
    a.append(t)
    lent=min(lent,len(t))
for i in range(lent,0,-1):
    q=a[0][0:i]
    flag=1
    ans=0
    for j in range(1,n):
        if(a[j][0:i]!=q):
            flag=0
            break
    if(flag==1):
        ans=1
        print(q)
        break
if(ans==0):
    print("\n")
```
# 2025.10.10
## [圣诞老人的礼物-Santa Clau’s Gifts](http://cs101.openjudge.cn/pctbook/M04110/)
```python
n,w=map(int,input().split())
a=[]
for i in range(n):
    x,y=map(int,input().split())
    t=x/y
    a.append([t,x,y])
a=sorted(a,key=lambda t:-t[0])
ans=0
for i in range(n):
    if(w>a[i][2]):
        w-=a[i][2]
        ans+=a[i][1]
    elif(0<w<=a[i][2]):
        ans+=a[i][0]*w
        break
    else:
        break
print("%0.1f" %(ans))
```
## [双向喜欢](https://sunnywhy.com/sfbj/3/7/569)
```python
n,q=map(int,input().split())
a=[[0 for _ in range(15)]for _ in range(15)]
for i in range(q):
    x,y=map(int,input().split())
    a[x][y]=1
flag=0
for i in range(n+1):
    for j in range(n+1):
        if(a[i][j]==1 and a[j][i]==1 and i!=j):
            flag=1
            break
if(flag==1):
    print("Yes")
else:
    print("No")
```
## [Bigram 分词](https://leetcode.cn/problems/occurrences-after-bigram/description/)
```python
class Solution:
    def findOcurrences(self, text: str, first: str, second: str) -> list[str]:
        txt=list(text.split())
        idx=0
        res=[]
        while(idx<=len(txt)-3):
            if(txt[idx]==first and txt[idx+1]==second):
                res.append(txt[idx+2])
            idx+=1
        return res
print(Solution().findOcurrences("alice is a good girl she is a good student","a","good"))
```
## [三方欢喜](https://sunnywhy.com/sfbj/3/7/570)
```python
n,q=map(int,input().split())
a=[[0 for _ in range(15)]for _ in range(15)]
for i in range(q):
    x,y=map(int,input().split())
    a[x][y]=1
flag=0
for i in range(n+1):
    for j in range(n+1):
        for k in range(n+1):
            if(i==j or j==k or k==i):
                continue
            if(a[i][j]==1 and a[j][k]==1 and a[k][i]==1):
                flag=1
                break
if(flag==1):
    print("Yes")
else:
    print("No")
```
## [倒排索引](http://cs101.openjudge.cn/pctbook/M06640/)
```python
n=int(input())
a=[]
for i in range(n):
    t=set(input().split())
    a.append(t)
m=int(input())
for i in range(m):
    word=input()
    res=[]
    flag=0
    for j in range(n):
        if(word in a[j]):
            flag=1
            res.append(j+1)
    if(flag==1):
        print(" ".join(map(str,res)))
    else:
        print("NOT FOUND")
```
## [无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/)
双指针，滑动窗口。
```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        a=set()
        ans=0
        r=0
        for i in range(len(s)):
            if(i!=0):
                a.remove(s[i-1])
            while(r<len(s) and s[r] not in a):
                a.add(s[r])
                r+=1
            ans=max(ans,r-i)
        return ans
print(Solution().lengthOfLongestSubstring("abcabcbb"))
```
## [字母异位词分组](https://leetcode.cn/problems/group-anagrams/description/)
1.字符串内部排序
2.defaultdict
```python
from collections import defaultdict
class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        res=defaultdict(list)
        for i in range(len(strs)):
            res["".join(sorted(strs[i]))].append(strs[i])
        return list(res.values())
print(Solution().groupAnagrams(["eat","tea","tan","ate","nat","bat"]))
```
## [最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence/description/)
set()查找为O(1).
range()耗时问题.
以每个数为开头查找。如果数列中包含x-1则跳过。
```python
class Solution:
    def longestConsecutive(self, nums: list[int]) -> int:
        nums=set(nums)
        ans=0
        for i in nums:
            if(i-1 in nums):
                continue
            else:
                idx=i+1
                while(idx in nums):
                    idx+=1
                ans=max(ans,idx-i)
        return ans
print(Solution().longestConsecutive([0,3,7,2,5,8,4,6,0,1]))
```
## [Another Divisibility Problem](https://codeforces.com/contest/2140/problem/B)
```python
n=int(input())
for i in range(n):
    x=int(input())
    y=999999999-x
    print(y)
```
## [所有子字符串美丽值之和](https://leetcode.cn/problems/sum-of-beauty-of-all-substrings/description/)
```python
class Solution:
    def beautySum(self, s: str) -> int:
        a=[0]*27
        ans=0
        for i in range(len(s)):
            a=[0]*27
            for j in range(i,len(s)):
                a[ord(s[j])-97]+=1
                maxm=0
                minm=505
                for k in range(26):
                    if(a[k]==0):
                        continue
                    maxm=max(maxm,a[k])
                    minm=min(minm,a[k])
                ans+=maxm-minm
        return ans
print(Solution().beautySum("aabcb"))
```
## [Cut Ribbon](https://codeforces.com/problemset/problem/189/A)
注意dp数组初始化。没有答案的情况置-inf.
```python
n,a,b,c=map(int,input().split())
dp=[float("-inf")]*(n+1)#切到长度n的最大片数
dp[0]=0
for i in range(min(a,b,c),n+1):
    if (i - a >= 0):
        dp[i] = max(dp[i], dp[i - a] + 1)
    if (i - b >= 0):
        dp[i] = max(dp[i], dp[i - b] + 1)
    if (i - c >= 0):
        dp[i] = max(dp[i], dp[i - c] + 1)
print(dp[n])
```
# 2025.10.11
## [吃糖果](http://cs101.openjudge.cn/pctbook/E02942/)
```python
n=int(input())
dp=[0,1,2]#i块的方案数
for i in range(3,n+1):
    dp.append(dp[i-1]+dp[i-2])
print(dp[n])
```
## [八皇后](http://cs101.openjudge.cn/pctbook/T02754/)
dfs.不要在标记状态的时候改变函数参数，直接在每一次搜索中修改。
```python
n=int(input())
res=[]
#x=[0]*8
y=[0]*8
z=[0]*15
w=[0]*15
def dfs(step,lst):
    if(step==8):
        res.append(lst)
        return
    for i in range(8):
        if(y[i]==0 and z[step+i]==0 and w[7+step-i]==0):
            y[i]=1
            z[step+i]=1
            w[7+step-i]=1
            dfs(step+1,lst+str(i+1))
            y[i]=0
            z[step+i]=0
            w[7+step-i]=0
dfs(0,"")
for i in range(n):
    t=int(input())
    print(res[t-1])
```
## [（201911）护林员盖房子](http://cs101.openjudge.cn/pctbook/M21577/)
二维前缀和。
```python
m,n=map(int,input().split())
a=[]
for i in range(m):
    t=list(map(int,input().split()))
    a.append(t)
pre=[[0 for _ in range(n+1)]for _ in range(m+1)]#向右向下分别移动一位
pre[1][1]=a[0][0]
for i in range(1,m+1):
    for j in range(1,n+1):
        pre[i][j]=pre[i-1][j]+pre[i][j-1]-pre[i-1][j-1]+a[i-1][j-1]
ans=0
for i in range(1,m+1):
    for j in range(1,n+1):
        for p in range(i,m+1):
            for q in range(j,n+1):
                if(pre[p][q]-pre[i-1][q]-pre[p][j-1]+pre[i-1][j-1]==0):
                    ans=max(ans,(p-i+1)*(q-j+1))
print(ans)
```
## [护林员盖房子 加强版](http://cs101.openjudge.cn/pctbook/T27205/)
最大子矩阵。转换为直方图最大矩形面积问题。对每一层考虑包含这一层的从上到下连续空地的最大长度，即为直方图的柱长。
悬线法：左右悬线，如果比当前高就用左侧的悬线长度更新当前悬线长度。（dp)
```python
m,n=map(int,input().split())
a=[]
l=[0]*(n+1)
r=[0]*(n+1)
s=[0]*(n+1)
ans=0
for i in range(m):
    l=list(map(int,input().split()))
    a.append(l)
for i in range(m):
    for j in range(n):
        if(a[i][j]==0):
            s[j]+=1
        else:
            s[j]=0
    for j in range(n):
        l[j]=r[j]=j
    for j in range(n):
        while(l[j]>0 and s[l[j]-1]>=s[j]):
            l[j]=l[l[j]-1]
    for j in range(n,-1,-1):
        while(r[j]<n-1 and s[r[j]+1]>=s[j]):
            r[j]=r[r[j]+1]
    for j in range(n):
        ans=max(ans,s[j]*(r[j]-l[j]+1))
print(ans)
```
## [咒语序列](http://cs101.openjudge.cn/practice/29952/)
用栈的思路解决。left,right分别记录左括号和右括号的数目，如果右括号多于左括号就同时置零，如果左==右就更新ans。
注意会有左括号始终多于右括号的情况，再从右往左扫一遍。
```python
s=input()
left=0
right=0
ans=0
for i in range(len(s)):
    if(s[i]=='('):
        left+=1
    else:
        right+=1
    if(right>left):
        left=0
        right=0
    elif(left==right):
        ans=max(ans,left*2)
s=s[::-1]
left=0
right=0
for i in range(len(s)):
    if(s[i]==')'):
        left+=1
    else:
        right+=1
    if(right>left):
        left=0
        right=0
    elif(left==right):
        ans=max(ans,left*2)
print(ans)
```
# 2025.10.13
## [护林员盖房子 加强版](http://cs101.openjudge.cn/pctbook/T27205/)
单调栈：仍然考虑每一根柱子左右第一个小于其高度的柱子。使用单调栈维护柱子的长度上升，如果遇到柱子长度变低就把不符合的柱子都弹出，弹出完剩下的栈顶就是左侧第一个小于其高度的柱子。而每个柱子只会被弹出一次，第一次使其弹出的柱子就是其右侧第一个小于等于其高度的柱子。注意右侧包含了柱子长度相等的情况，但是在这种情况下最右侧的那根柱子会保留正确答案。
单调栈可以解决一维数组中找到左右第一个小于该数的位置。如果需要确切的右边界，从右往左再扫一遍即可。
[柱状图中最大的矩形](https://leetcode.cn/problems/largest-rectangle-in-histogram/solutions/266844/zhu-zhuang-tu-zhong-zui-da-de-ju-xing-by-leetcode-/)
```python
from collections import deque
m,n=map(int,input().split())
a=[]
s=[0]*n
l=[-1]*n
r=[n]*n
ans=0
t=deque()
for i in range(m):
    l=list(map(int,input().split()))
    a.append(l)
for i in range(m):
    for j in range(n):
        if(a[i][j]==0):
            s[j]+=1
        else:
            s[j]=0
    t.clear()
    l = [-1]*n
    r = [n]*n
    for j in range(n):
        while(t and s[j]<=s[t[-1]]):
            r[t[-1]]=j
            t.pop()
        l[j]=t[-1] if t else -1
        t.append(j)
    for j in range(n):
        ans=max(ans,s[j]*(r[j]-l[j]-1))
print(ans)
```
## 差分数组、扫描线
yhf在群里发的文档。
差分数组、扫描线，解释并python示例出来

“差分数组”和“扫描线（sweep line）”这两个算法思想非常常用，尤其在处理**区间修改、区间计数、区间重叠**等问题时。
下面我会逐步讲清楚它们的**原理、区别、联系**，并附上**清晰的 Python 示例**。

------

一、差分数组（Difference Array）

1. 核心思想

差分数组是一种高效处理**区间加减操作**的技巧。

假设你有一个数组 `a = [a1, a2, a3, ..., an]`，
构造它的**差分数组** `diff`：

```text
diff[i] = a[i] - a[i-1]   （其中 a[0] 视为 0）
```

- 当要给区间 `[l, r]` 中的所有元素 +x 时：

  ```
  diff[l] += x
  diff[r+1] -= x    （如果 r+1 <= n）
  ```

最后，通过一次前缀和即可恢复出修改后的原数组。

2. 示例：区间加法

题目

初始数组为 `[0, 0, 0, 0, 0]`
操作：

1. 对区间 [1, 3] 加 2
2. 对区间 [2, 4] 加 3

问最终数组？

代码

```python
n = 5
a = [0] * n
diff = [0] * (n + 1)

# 区间加函数
def add(l, r, x):
    diff[l] += x
    if r + 1 < len(diff):
        diff[r + 1] -= x

# 两次操作
add(1, 3, 2)
add(2, 4, 3)

# 还原结果
a[0] = diff[0]
for i in range(1, n):
    a[i] = a[i - 1] + diff[i]

print(a)  # [2, 5, 5, 3, 0]
```

✅ 输出解释：

- 第1步 [1,3]+2 → `[0,2,2,2,0]`
- 第2步 [2,4]+3 → `[0,2,5,5,3]`

------

二、扫描线算法（Sweep Line）

1. 核心思想

扫描线是处理**区间重叠、事件统计**的通用思想。
可以理解为一条“从左到右扫描”的直线，遇到事件点就改变当前状态。

在区间问题中，通常：

- 区间左端点代表“增加一个活动”
- 区间右端点代表“结束一个活动”

把所有端点事件放在一起排序，顺序扫描。

2. 示例：统计同时在线人数最大值

题目

给出若干人的上网时间区间，求某一时刻同时在线的最大人数。

输入：

```python
[1, 4]
[2, 5]
[7, 9]
```

输出：

```python
2
```

代码

```python
intervals = [(1, 4), (2, 5), (7, 9)]

events = []
for l, r in intervals:
    events.append((l, 1))   # 进入 +1
    events.append((r, -1))  # 离开 -1

events.sort()  # 按时间排序

cur = 0
max_online = 0
for time, delta in events:
    cur += delta
    max_online = max(max_online, cur)

print(max_online)  # 2
```

✅ 扫描过程：

| 时间 | 变化 | 当前人数 |
| ---- | ---- | -------- |
| 1    | +1   | 1        |
| 2    | +1   | 2        |
| 4    | -1   | 1        |
| 5    | -1   | 0        |
| 7    | +1   | 1        |
| 9    | -1   | 0        |

最大值为 2。

------

三、差分数组 vs 扫描线

| 特性       | 差分数组                     | 扫描线                 |
| ---------- | ---------------------------- | ---------------------- |
| 典型用途   | 区间加减更新                 | 区间重叠/统计          |
| 操作       | 用 diff[] 标记变化           | 用事件排序             |
| 时间复杂度 | O(n + q)                     | O(q log q)             |
| 结果       | 修改后的数组                 | 最大值、重叠次数等统计 |
| 思想联系   | 本质上都是“处理区间端点变化” | 只是实现方式不同       |

------

四、综合示例：区间覆盖次数

题目：
给出若干区间，输出每个位置被覆盖的次数。

输入：

```python
区间：[1,3], [2,5], [4,6]
n = 7
```

差分写法

```python
n = 7
intervals = [(1,3), (2,5), (4,6)]

diff = [0]*(n+2)
for l, r in intervals:
    diff[l] += 1
    diff[r+1] -= 1

cover = [0]*(n+1)
cover[0] = diff[0]
for i in range(1, n+1):
    cover[i] = cover[i-1] + diff[i]

print(cover[1:])  # [1,2,2,2,1,1,0]
```

扫描线写法

```python
events = []
for l, r in intervals:
    events.append((l, 1))
    events.append((r + 1, -1))

events.sort()
res = [0]*(n+1)
cur = 0
idx = 0
for i in range(1, n+1):
    while idx < len(events) and events[idx][0] == i:
        cur += events[idx][1]
        idx += 1
    res[i] = cur

print(res[1:])  # [1,2,2,2,1,1,0]
```

------

✅ 总结一句话：

- **差分数组**：适合你知道数组长度、需要多次“区间加减”。
- **扫描线**：适合你处理动态事件（区间开始/结束）、求最大重叠、覆盖长度等。
## [排队做实验](http://cs101.openjudge.cn/pctbook/M21554/)
```python
n=int(input())
a=list(map(int,input().split()))
t=[]
for i in range(n):
    t.append([a[i],i+1])
t=sorted(t,key=lambda x:x[0])
s=0
q=[]
for i in range(n):
    q.append(t[i][1])
    s+=t[i][0]*(n-i-1)
s=s/n
print(" ".join(map(str,q)))
print("%0.2f" %s)
```
## [买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/description/)
扫一遍，把历史最低价处理出来。每天卖掉的和历史最低价作差。
```python
class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        minm=[]
        minm.append(prices[0])
        for i in range(1,len(prices)):
            minm.append(min(minm[i-1],prices[i]))
        maxm=[]
        maxm.append(prices[-1])
        for i in range(1,len(prices)):
            maxm.append(max(maxm[i-1],prices[-i-1]))
        ans=0
        for i in range(len(prices)-1):
            ans=max(ans,maxm[len(prices)-i-2]-minm[i])
        return ans
print(Solution().maxProfit([1,4,2]))
```
## [有多少种合法的出栈顺序](http://cs101.openjudge.cn/practice/27217/)
卡特兰数。一开始WA是因为没有用整除而是用了除，此时a的类型为小数，算到最后就爆了。
[卡特兰数](https://oi-wiki.org/math/combinatorics/catalan/)
```python
from math import comb
n=int(input())
a=1
# if(n==1):
#     print(1)
# else:
#     print(comb(2*n,n)//(n+1))
for i in range(2,n+1):
    a=(4*i-2)*a//(i+1)
print(a)
```
## [有效的括号](https://leetcode.cn/problems/valid-parentheses/description/)
```python
class Solution:
    def isValid(self, s: str) -> bool:
        def check(x,y):
            if(x=='(' and y==')'):
                return True
            if(x=='[' and y==']'):
                return True
            if(x=='{' and y=='}'):
                return True
            return False
        a=[]
        flag=1
        for i in range(len(s)):
            if(s[i]=='(' or s[i]=='[' or s[i]=='{'):
                a.append(s[i])
            else:
                if(len(a)==0):
                    flag=0
                    break
                if(not check(a[-1],s[i])):
                    flag=0
                    break
                a.pop()
        if(len(a)!=0):
            flag=0
        if(flag==1):
            return True
        else:
            return False
```
# 2025.10.14
## [军备竞赛](http://cs101.openjudge.cn/pctbook/M18211/)
```python
p=int(input())
a=list(map(int,input().split()))
a.sort()
k=0
q=len(a)-1
ans=0
while(q>=k):
    if(p>=a[k]):
        p-=a[k]
        k+=1
    else:
        x1=k
        x2=len(a)-1-q
        if(x2>=x1):
            break
        else:
            p+=a[q]
            q-=1
    ans=max(ans,k-len(a)+1+q)
    # print(k,q,p,ans)
print(ans)
```
## [岛屿周长](http://cs101.openjudge.cn/pctbook/M12558/)
```python
dx=[-1,0,1,0]
dy=[0,1,0,-1]
ans=0
n,m=map(int,input().split())
vis=[[0 for _ in range(m+2)]for _ in range(n+2)]
def dfs(x,y):
    global ans
    flag=0
    for i in range(4):
        if(a[x+dx[i]][y+dy[i]]==1):
            flag+=1
    ans+=(4-flag)
    for i in range(4):
        if(a[x+dx[i]][y+dy[i]]==1 and vis[x+dx[i]][y+dy[i]]==0):
            vis[x+dx[i]][y+dy[i]]=1
            dfs(x+dx[i],y+dy[i])
            #vis[x+dx[i]][y+dy[i]] = 0
a=[]
a.append([0]*(m+2))
for i in range(n):
    l=list(map(int,input().split()))
    l.insert(0,0)
    l.append(0)
    a.append(l)
a.append([0]*(m+2))
for i in range(n+2):
    for j in range(m+2):
        if(a[i][j]==1):
            break
    if(a[i][j]==1):
        break
vis[i][j]=1
dfs(i,j)
print(ans)
```
## [计算鞍点](http://cs101.openjudge.cn/pctbook/E03670/)
```python
a=[]
maxm=[]#[0-n-1][idx]
minm=[]#[idx][0-n-1]
for i in range(5):
    t=list(map(int,input().split()))
    a.append(t)
    maxm.append(t.index(max(t)))
for i in range(5):
    t=float("inf")
    idx=-1
    for j in range(5):
        if(a[j][i]<t):
            idx=j
            t=a[j][i]
    minm.append(idx)
flag=0
for i in range(5):
    if(minm[maxm[i]]==i):
        flag=1
        print(i+1,maxm[i]+1,a[i][maxm[i]])
if(flag==0):
    print("not found")
```
## [Woodcutters](https://codeforces.com/contest/545/problem/C)
贪心。左右两端必取，然后考察每两棵树之间的段。这段空地只需要考虑左树向右倒和右树向左倒的情况，因为其他情况必然会跨越树桩。
```python
n=int(input())
a=[]
b=[]
tree=[]
for i in range(n):
    x,y=map(int,input().split())
    a.append(x)
    b.append(y)
    tree.append([x-y,x])
    tree.append([x,x+y])
ans=1
check=[0]*n
check[0]=1
for i in range(1,n):
    l = a[i] - a[i - 1]
    if(check[i-1]==0):
        if(b[i-1]+b[i]<l):
            check[i-1]=check[i]=1
            ans+=2
        elif(b[i-1]<l):
            check[i-1]=1
            ans+=1
        elif(b[i]<l):
            check[i]=1
            ans+=1
    else:
        if(b[i]<l):
            check[i]=1
            ans+=1
if(check[n-1]==0):
    ans+=1
print(ans)
```
## [Potions (Easy Version)](https://codeforces.com/problemset/problem/1526/C1)
后悔解法。
维护一个小根堆。不管怎样先把药水喝了，如果健康值为负值就把堆顶的药水依次吐出来。
若dp则记录喝i瓶水的剩余生命值。
```python
import heapq
n=int(input())
a=list(map(int,input().split()))
t=[]
sum=0
heapq.heapify(t)
for i in range(n):
    sum+=a[i]
    heapq.heappush(t,a[i])
    while(sum<0 and len(t)>0):
        x=heapq.heappop(t)
        sum-=x
print(len(t))
```
## [最大最小整数](http://cs101.openjudge.cn/practice/12559/)
冒泡排序。
> 提示 位数不同但前几位相同的时候。例如： 898 8987，大整数是898+8987，而不是8987+898。
因此重复每一位自身使所有数长度相同亦可。
```python
n=int(input())
a=list(map(str,input().split()))
for i in range(n):
    for j in range(i+1,n):
        if(a[i]+a[j]<a[j]+a[i]):
            a[i],a[j]=a[j],a[i]
print("".join(a),end=" ")
for i in range(n):
    for j in range(i+1,n):
        if(a[i]+a[j]>a[j]+a[i]):
            a[i],a[j]=a[j],a[i]
print("".join(a))
```
## [因材施教](http://cs101.openjudge.cn/practice/19948/)
对差分数组排序。可以证明取数组中的m-n个值和分组一一对应，因此取最小的m-n个即可。
```python
n,m=map(int,input().split())
a=list(map(int,input().split()))
a.sort()
dif=[]
for i in range(n-1):
    dif.append(a[i+1]-a[i])
dif.sort()
ans=0
for i in range(n-m):
    ans+=dif[i]
print(ans)
```
## [Light It Up](https://codeforces.com/contest/1000/problem/B)
> 计算ans：添加处及之前的奇数项，加上添加处之后的（本来的）偶数项，再减去添加处与本来开灯的时间点相差的1个时间单位。
被greedy的tag骗了。
```python
n,m=map(int,input().split())
a=list(map(int,input().split()))
a.append(m)
a.insert(0,0)
ans=0
dif=[]
pre_odd=[]
pre_even=[]
for i in range(n+1):
    dif.append(a[i+1]-a[i])
pre_odd.append(0)
pre_odd.append(dif[1])
pre_even.append(dif[0])
for i in range(2,n+1):
    if(i%2==0):
        pre_even.append(pre_even[i//2-1]+dif[i])
    else:
        pre_odd.append(pre_odd[i//2]+dif[i])
ans=pre_even[-1]
for i in range(1,n+1,2):
        ans=max(ans,pre_even[(i-1)//2]+pre_odd[-1]-pre_odd[i//2]-1)
print(ans)
```
## [XXXXX](https://codeforces.com/problemset/problem/1364/A)
![image](https://img2024.cnblogs.com/blog/2669443/202510/2669443-20251014222051825-37421162.png)
```python
t=int(input())
for i in range(t):
    n,m=map(int,input().split())
    a=list(map(int,input().split()))
    res=sum(a)
    ans=n
    if(res%m!=0):
        print(n)
    else:
        flag=0
        idx=0
        while(res%m==0 and idx<n):
            res-=a[idx]
            idx+=1
        if(res%m!=0):
            flag=1
        ans=min(ans,idx)
        res=sum(a)
        idx=n-1
        while(res%m==0 and idx>=0):
            res-=a[idx]
            idx-=1
        if(res%m!=0):
            flag=1
        ans=min(ans,n-1-idx)
        if(flag==0):
            print(-1)
        else:
            print(n-ans)
```
# 2025.10.16
## [生存游戏](http://cs101.openjudge.cn/practice/12560/)
保护圈。
```python
n,m=map(int,input().split())
a=[]
a.append([0]*(m+2))
for i in range(n):
    l=list(map(int,input().split()))
    l.insert(0,0)
    l.append(0)
    a.append(l)
a.append([0]*(m+2))
b=[[0 for _ in range(m+2)]for _ in range(n+2)]
for i in range(1,n+1):
    for j in range(1,m+1):
        cnt=a[i-1][j-1]+a[i-1][j]+a[i-1][j+1]+a[i][j-1]+a[i][j+1]+a[i+1][j-1]+a[i+1][j]+a[i+1][j+1]
        if(a[i][j]==1):
            if(cnt<2 or cnt>3):
                b[i][j]=0
            else:
                b[i][j]=1
        else:
            if(cnt==3):
                b[i][j]=1
for i in range(1,n+1):
    for j in range(1,m):
        print(b[i][j],end=" ")
    print(b[i][m])
```
## [完美立方](http://cs101.openjudge.cn/pctbook/M02810/)
直接开三次根再取整会产生进度问题。预存每个数的三次方。枚举三个加和的数避免重复运算。
```python
n=int(input())
res=[]
a=set()
for i in range(101):
    a.add(i*i*i)
for i in range(2,n):
    for j in range(i,n):
        for k in range(j,n):
            t=i**3+j**3+k**3
            if(t>n**3):
                continue
            if(t in a):
                res.append([round(t**(1/3)),i,j,k])
res.sort()
for i in range(len(res)):
    print("Cube = %d, Triple = (%d,%d,%d)" %(res[i][0],res[i][1],res[i][2],res[i][3]))
```
## [序列合并](https://sunnywhy.com/sfbj/4/6/176)
双指针。
```python
n,m=map(int,input().split())
a=list(map(int,input().split()))
b=list(map(int,input().split()))
i=0
j=0
res=[]
while(i<n and j<m):
    if(a[i]<=b[j]):
        res.append(a[i])
        i+=1
    else:
        res.append(b[j])
        j+=1
res.extend(a[i:n])
res.extend(b[j:m])
print(" ".join(map(str,res)))
```
## [判断八皇后](https://sunnywhy.com/sfbj/4/3/146)
```python
a=[]
for i in range(8):
    t=list(map(int,input().split()))
    a.append(t)
x=set()
y=set()
z=set()
w=set()
flag=1
for i in range(8):
    temp=sum(a[i])
    if(temp!=1):
        flag=0
        break
    for j in range(8):
        if(a[i][j]==1):
            x.add(i)
            y.add(j)
            z.add(i+j)
            w.add(i-j)
if(len(y)!=8 or len(z)!=8 or len(w)!=8 or flag==0):
    print("NO")
else:
    print("YES")
```
## [一一相依](https://sunnywhy.com/sfbj/3/7/578)
双指针。
```python
n,k=map(int,input().split())
s=input()
pre=[]
pre.append(int(s[0]))
for i in range(1,n):
    pre.append(pre[i-1]+int(s[i]))
i=0
j=0
ans=0
while(j<n):
    if(i==0):
        cnt=(j-i+1)-pre[j]
    else:
        cnt=(j-i+1)-(pre[j]-pre[i-1])
    if(cnt<=k):
        ans=max(ans,j-i+1)
        j+=1
    else:
        i+=1
print(ans)
```
# 2025.10.19
## [图的拉普拉斯矩阵](http://cs101.openjudge.cn/pctbook/E19943/)
```python
n,m=map(int,input().split())
d=[[0 for _ in range(n)]for _ in range(n)]
a=[[0 for _ in range(n)]for _ in range(n)]
for i in range(m):
    x,y=map(int,input().split())
    d[x][x]+=1
    d[y][y]+=1
    a[x][y]=1
    a[y][x]=1
for i in range(n):
    lst=[]
    for j in range(n):
        lst.append(d[i][j]-a[i][j])
    print(" ".join(map(str,lst)))
```
## [Same Differences](https://codeforces.com/contest/1520/problem/D)
dict、defaultdict的时间复杂度均为O(1).
![image](https://img2024.cnblogs.com/blog/2669443/202510/2669443-20251019211027365-2000622313.png)
[Complexity of Python Operations](https://ics.uci.edu/~pattis/ICS-33/lectures/complexitypython.txt)
```python
from collections import defaultdict
t=int(input())
for i in range(t):
    n=int(input())
    a=list(map(int,input().split()))
    ans=0
    b=defaultdict(int)
    #b=[0]*(200005)
    for j in range(n):
        t=a[j]-j
        b[t]+=1
    for j in b.values():
        if(j==1):
            continue
        ans+=j*(j-1)//2
    print(ans)
```
## [Saruman's Army](http://cs101.openjudge.cn/pctbook/M19757/)
两个while循环，一个找开始的点，另一个找放置点。找完一轮之后开始新的一轮。
```python
while(True):
    r,n=map(int,input().split())
    if(r==-1 and n==-1):
        break
    a=list(map(int,input().split()))
    a.sort()
    i=0
    ans=0
    while(i<n):
        start=a[i]
        i+=1
        while(i<n and a[i]<=start+r):
            i+=1
        cur=a[i-1]
        while(i<n and a[i]<=cur+r):
            i+=1
        ans+=1
    print(ans)
```
# 2025.10.21
## [垃圾炸弹](http://cs101.openjudge.cn/pctbook/M04133/)
在接收数据时更新每个点处放置炸弹时可以清除的垃圾数。在range()中使用min()、max()以避免分类讨论。注意边界处的方形边长可以小于2d。
```python
d=int(input())
n=int(input())
a=[[0 for _ in range(1030)]for _ in range(1030)]
for i in range(n):
    x,y,z=map(int,input().split())
    for j in range(max(0,x-d),min(1024,x+d)+1):
        for k in range(max(0,y-d),min(1024,y+d)+1):
            a[j][k]+=z
res=0
ans=0
for i in range(1025):
    for j in range(1025):
        if(a[i][j]>ans):
            res=1
            ans=a[i][j]
        elif(a[i][j]==ans):
            res+=1
print(res,ans)
```
## [约瑟夫问题](http://cs101.openjudge.cn/pctbook/M02746/)
使用递推公式或使用队列模拟。递推公式为i=(i+m-1)%总人数.
模拟先全部进队，再依次从头部取出并放回尾部，由此形成一个环。
队列的遍历就是拿出再放回。
```python
from collections import deque
while(True):
    n,m=map(int,input().split())
    if(n==0 and m==0):
        break
    a=deque()
    for i in range(1,n+1):
        a.append(i)
    while(len(a)>1):
        for i in range(m-1):
            a.append(a.popleft())
        a.popleft()
    print(a.popleft())
```
## [摆动序列](http://cs101.openjudge.cn/pctbook/M26976/)
考虑转折次数。开一个旗帜变量记录上一次是向上还是向下。如果发生转折就答案+1。最后的序列长度即为转折次数+1.注意开头结尾，以及如果中间一段是平的也算一次转折。
```python
n=int(input())
nums=list(map(int,input().split()))
dir=0
ans=0
for i in range(1,n):
    if(nums[i]>nums[i-1]):
        if(dir==1):
            continue
        ans+=1
        dir=1
    elif(nums[i]<nums[i-1]):
        if(dir==-1):
            continue
        ans+=1
        dir=-1
print(ans+1)
```
## [分发糖果](http://cs101.openjudge.cn/pctbook/T26971/)
考虑连续上升子序列，此时会对子序列中的每一个人有约束。但是从左往右扫的时候无法以O(n)的复杂度判断下降子序列。因此从右往左再扫一遍。left，right数组分别记录扫描过程中要求的最少糖果数，初值置1.最后每个人的最少糖果数即为两数组中记录的较大值，此时一定满足条件。
```python
n=int(input())  
ratings=list(map(int,input().split()))  
idx=0  
ans=0  
left=[1]*n  
right=[1]*n  
for i in range(1,n):  
    if(ratings[i]>ratings[i-1]):  
        left[i]=left[i-1]+1  
for i in range(n-2,-1,-1):  
    if(ratings[i]>ratings[i+1]):  
        right[i]=right[i+1]+1  
for i in range(n):  
    ans+=max(left[i],right[i])  
print(ans)
```
# 2025.10.25
## [Fill in the Matrix](https://codeforces.com/problemset/problem/1868/A)
考虑m×m的矩阵，首行为0-(m-1)，之后每一行依次向右移动一位。此时每一列都包含了0-(m-1)所有的数。删除一行，所有列的MEX值即为0-(m-1)，此时数列的美丽值最大。而当n<m-1时，直接取前面构造的n行，所有列的MEX值可以取遍0-n，此时数列的美丽值为n+1.注意特判一列的情况，此时美丽值为1.
```python
# 012
# 120
# 012
# n行m列
# n>=m-1:m
# n<m-1:n+1
# 0123456
# 1234560
# 2345601
t=int(input())
for i in range(t):
    n,m=map(int,input().split())
    if(m==1):
        print(0)
        for i in range(n):
            print(0)
    elif(n>=m-1):
        print(m)
        for j in range(m-1):
            lst=[]
            for k in range(m):
                lst.append((j+k)%m)
            print(" ".join(map(str,lst)))
        for j in range(n-m+1):
            lst=[]
            for k in range(m):
                lst.append(k)
            print(" ".join(map(str,lst)))
    else:
        print(n+1)
        for j in range(n):
            lst=[]
            for k in range(m):
                lst.append((j+k)%m)
            print(" ".join(map(str,lst)))
```
## [神奇的幻方](http://cs101.openjudge.cn/pctbook/M07207/)
```python
n=int(input())
n=n*2-1
a=[[0 for _ in range(n)]for _ in range(n)]
if(n==1):
    print(1)
else:
    x=0
    y=n//2
    for i in range(1,n*n+1):
        a[x][y]=i
        if(x==0 and y==n-1):
            x=x+1
        elif(x==0):
            x=n-1
            y=y+1
        elif(y==n-1):
            y=0
            x=x-1
        elif(a[x-1][y+1]!=0):
            x=x+1
        else:
            x=x-1
            y=y+1
    for i in range(n):
        for j in range(n-1):
            print(a[i][j],end=" ")
        print(a[i][n-1])
```
# 2025.10.27
## [世界杯只因](http://cs101.openjudge.cn/pctbook/T27104/)
求完全覆盖区间的最小子区间数。按区间开头排序，往后一直搜到留下空隙的子区间之前，取这些子区间中结尾最大的。
用二维数组会超内存，可以用数组套元组。
```python
n=int(input())
a=list(map(int,input().split()))
lst=[]
for i in range(n):
    x=max(1,i+1-a[i])
    y=min(n,i+1+a[i])
    lst.append((x,y))
lst.sort()
right=0
idx=0
ans=0
while(right<n):
    maxr=right
    while(idx<n and lst[idx][0]<=right+1):
        maxr=max(maxr,lst[idx][1])
        idx+=1
    right=maxr
    ans+=1
print(ans)
```
## [【深基7.例4】歌唱比赛](https://www.luogu.com.cn/problem/P5738)
```python
n,m=map(int,input().split())
a=[]
for i in range(n):
    lst=list(map(int,input().split()))
    lst.sort()
    s=sum(lst)-lst[0]-lst[-1]
    a.append(s)
print("%0.2f" %(max(a)/(m-2)))
```
## [后序表达式求值](http://cs101.openjudge.cn/practice/24588/)
```python
n=int(input())
for i in range(n):
    t=list(input().split())
    a=[]
    for j in t:
        if(j=='+'):
            y=a.pop()
            x=a.pop()
            a.append(x+y)
        elif(j=='-'):
            y=a.pop()
            x=a.pop()
            a.append(x-y)
        elif(j=='*'):
            y=a.pop()
            x=a.pop()
            a.append(x*y)
        elif(j=='/'):
            y=a.pop()
            x=a.pop()
            a.append(x/y)
        else:
            a.append(float(j))
    print("%0.2f" %(a.pop()))
```
## [Bomb Game](http://cs101.openjudge.cn/practice/02659/)
```python
a,b,k=map(int,input().split())
m=[[1 for _ in range(b)]for _ in range(a)]
for i in range(k):
    r,s,p,t=map(int,input().split())
    r-=1
    s-=1
    p//=2
    if(t==0):
        for j in range(max(0,r-p),min(a-1,r+p)+1):
            for w in range(max(0,s-p),min(b-1,s+p)+1):
                m[j][w]=t
    elif(t==1):
        for j in range(a):
            for w in range(b):
                if(max(0,r-p)<=j<=min(a-1,r+p) and max(0,s-p)<=w<=min(b-1,s+p)):
                    continue
                else:
                    m[j][w]=0
ans=0
for i in range(a):
    for j in range(b):
        if(m[i][j]==1):
            ans+=1
print(ans)
```
## [上机考试](http://cs101.openjudge.cn/pctbook/M16531/)
```python
m,n=map(int,input().split())
a=[]
b=[]
s=[]
a.append([-1]*(n+2))
for i in range(m):
    lst=list(map(int,input().split()))
    lst.insert(0,-1)
    lst.append(-1)
    a.append(lst)
a.append([-1]*(n+2))
for i in range(m*n):
    lst=list(map(int,input().split()))
    b.append(sum(lst))
    if(len(lst)==0):
        s.append(-1)
    else:
        temp=0
        for j in lst:
            temp+=j
            temp<<=1
        s.append(temp)
c=sorted(b)
c=c[::-1]
t=int(m*n*0.4)
ans=0
if(t>0):
    score=c[t-1]
    if(c[t]==score):
        for i in range(t):
            if(c[i]>score):
                ans+=1
            else:
                break
    else:
        ans=t
res=0
dx=[-1,0,1,0]
dy=[0,1,0,-1]
for i in range(1,m+1):
    for j in range(1,n+1):
        for k in range(4):
            x=i+dx[k]
            y=j+dy[k]
            if(a[x][y]==-1):
                continue
            else:
                if(s[a[i][j]]==s[a[x][y]]):
                    res+=1
                    break
print(res,ans)
```
## [螺旋矩阵](http://cs101.openjudge.cn/pctbook/M18106/)
两个数组分别记录上下左右四个方向，dir记录具体的方向。
```python
n=int(input())
a=[[0 for _ in range(n)]for _ in range(n)]
dir=0
x=0
y=0
dy=[1,0,-1,0]
dx=[0,1,0,-1]
for i in range(1,n*n+1):
    a[x][y]=i
    x0=x+dx[dir]
    y0=y+dy[dir]
    if(x0<0 or x0>=n or y0<0 or y0>=n or a[x0][y0]!=0):
        dir=(dir+1)%4
        x0=x+dx[dir]
        y0=y+dy[dir]
    x=x0
    y=y0
for i in range(n):
    print(" ".join(map(str,a[i])))
```
## [斐波拉契数列-大数据版](https://sunnywhy.com/problem/893)
[P1962 斐波那契数列 题解](https://www.luogu.com.cn/problem/solution/P1962)
矩阵乘法+矩阵快速幂。
```python
mod=10**9+7
def mul(x,y,p,q,r):
    qaq=[[0 for _ in range(q)]for _ in range(p)]
    for i in range(p):
        for j in range(q):
            for k in range(r):
                qaq[i][j]+=x[i][k]*y[k][j]%mod
                qaq[i][j]%=mod
    return qaq
def quick_power(x,n):
    t=[[1,0],[0,1]]
    while(n):
        if(n&1):
            t=mul(t,x,2,2,2)
        x=mul(x,x,2,2,2)
        n>>=1
    return t
n=int(input())
a=[[1,1]]
base=[[1,1],[1,0]]
if(n==1):
    print(1)
else:
    ans=mul(a,quick_power(base,n-2),1,2,2)
    print(ans[0][0])
```
## [【模板】矩阵快速幂](https://www.luogu.com.cn/problem/P3390)
```python
mod=10**9+7
def mul(x,y,p,q,r):
    qaq=[[0 for _ in range(q)]for _ in range(p)]
    for i in range(p):
        for j in range(q):
            for k in range(r):
                qaq[i][j]+=x[i][k]*y[k][j]%mod
                qaq[i][j]%=mod
    return qaq
def quick_power(x,k):
    global n
    t=[[0 for _ in range(n)]for _ in range(n)]
    for i in range(n):
        t[i][i]=1
    while(k):
        if(k&1):
            t=mul(t,x,n,n,n)
        x=mul(x,x,n,n,n)
        k>>=1
    return t
n,k=map(int,input().split())
a=[]
for i in range(n):
    lst=list(map(int,input().split()))
    a.append(lst)
ans=quick_power(a,k)
for i in range(n):
    print(" ".join(map(str,ans[i])))
```
## [汉诺塔问题(Tower of Hanoi)](http://cs101.openjudge.cn/pctbook/M04147/)
递归。
```python
def hanoi(x,a,b,c):
    if(x==0):
        return
    hanoi(x-1,a,c,b)
    print("%d:%s->%s" %(x,a,c))
    hanoi(x-1,b,a,c)
n,a,b,c=input().split()
n=int(n)
hanoi(n,a,b,c)
```
# 2025.10.28
## [晶矿的个数](http://cs101.openjudge.cn/pctbook/M05585/)
对每个点dfs，如果搜索过就标记。开始搜索的次数就是晶矿的个数。
```python
k=int(input())
dx=[0,1,0,-1]
dy=[1,0,-1,0]
def dfs(x,y,val):
    for i in range(4):
        x0=x+dx[i]
        y0=y+dy[i]
        if(0<=x0<n and 0<=y0<n):
            if(a[x0][y0]==val and vis[x0][y0]==0):
                vis[x0][y0]=1
                dfs(x0,y0,val)
for temp in range(k):
    n=int(input())
    a=[]
    for i in range(n):
        lst=input()
        a.append(lst)
    vis=[[0 for _ in range(n)]for _ in range(n)]
    ansr=0
    ansb=0
    for i in range(n):
        for j in range(n):
            if(vis[i][j]==1):
                continue
            if(a[i][j]=='r'):
                vis[i][j]=1
                dfs(i,j,a[i][j])
                ansr+=1
            elif(a[i][j]=='b'):
                vis[i][j]=1
                dfs(i,j,a[i][j])
                ansb+=1
    print(ansr,ansb)
```
## [岛屿数量](https://leetcode.cn/problems/number-of-islands/description/)
```python
class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        m=len(grid)
        n=len(grid[0])
        vis=[[0 for _ in range(n)]for _ in range(m)]
        dx=[1,0,-1,0]
        dy=[0,-1,0,1]
        def dfs(x,y):
            for i in range(4):
                x0=x+dx[i]
                y0=y+dy[i]
                if(0<=x0<m and 0<=y0<n and vis[x0][y0]==0 and grid[x0][y0]=='1'):
                    vis[x0][y0]=1
                    dfs(x0,y0)
        ans=0
        for i in range(m):
            for j in range(n):
                if(vis[i][j]==0 and grid[i][j]=='1'):
                    dfs(i,j)
                    ans+=1
        return ans
print(Solution().numIslands([["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]))
print(Solution().numIslands([["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]))
```

## [Strange Towers of Hanoi](http://cs101.openjudge.cn/practice/01958/)
三阶汉诺塔的次数为$2^n-1$.根据题目提示计算即可。
![](https://ik.imagekit.io/Amyxue/25fall-Assignment/Assignment_Amy_OCFuf8dQq)
[oeis-A007664](https://oeis.org/A007664)
类似递推可得n个圆盘时m阶Hanoi塔的最小移动次数。Frame-Stewart algorithm:
$T(m,n)=\mathop{min}\limits_{1 \leq r<n}(2T(m,n-r)+T(m-1,r))$
[多柱汉诺塔的Frame-Stewart算法](https://blog.csdn.net/Tribleave/article/details/83422777)
```python
def hanoi3(n):
    return 2**n-1
def hanoi4(n):
    if(n==1):
        return 1
    ans=float("inf")
    for i in range(1,n):
        ans=min(ans,hanoi4(n-i)+hanoi3(i)+hanoi4(n-i))
    return ans
for i in range(1,13):
    print(hanoi4(i))
```
## [全排列](https://leetcode.cn/problems/permutations/description/)
注意数组复制的浅拷贝问题。arr=arr1.copy()可以深拷贝。
```python
class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        vis=[0]*len(nums)
        ans=[]
        def dfs(step,res):
            if(step==len(nums)):
                ans.append(res)
                return
            for i in range(len(nums)):
                if(vis[i]==0):
                    vis[i]=1
                    temp=res.copy()
                    temp.append(nums[i])
                    dfs(step+1,temp)
                    vis[i]=0
        dfs(0,[])
        return ans
print(Solution().permute([1,2,3]))
print(Solution().permute([0,1]))
print(Solution().permute([1]))
```
## [Gold Rush](https://codeforces.com/problemset/problem/1829/D)
注意递归调用函数的时候函数的返回值类型是什么。
```python
t=int(input())
def dfs(lst,m):
    if(m in lst):
        return True
    flag=0
    for i in lst:
        if(i%3==0):
            flag=1
            qaq=lst.copy()
            qaq.remove(i)
            qaq.add(i//3)
            qaq.add(i//3*2)
            return dfs(qaq,m)
    if(flag==0):
        return False
for i in range(t):
    n,m=map(int,input().split())
    if(n==m):
        print("YES")
    elif(n<m):
        print("NO")
    else:
         lst=set()
         lst.add(n)
         if(dfs(lst,m)):
             print("YES")
         else:
             print("NO")
```
## [子集](https://leetcode.cn/problems/subsets/description/)
使用二进制存储是否选取某元素。
```python
class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        n=len(nums)
        ans=[]
        for i in range(1<<n):
            res=[]
            for j in range(n):
                if(i&1<<j):
                    res.append(nums[j])
            ans.append(res)
        return ans
print(Solution().subsets(([1,2,3])))
print(Solution().subsets(([0])))
```
# 2025.10.31
## [电话号码的字母组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/description/)
```python
class Solution:
    def letterCombinations(self, digits: str) -> list[str]:
        tele = {2: ['a', 'b', 'c'], 3: ['d', 'e','f'],4:['g','h','i'],5:['j','k','l'],6:['m','n','o'],7:['p','q','r','s'],8:['t','u','v'],9:['w','x','y','z']}
        res=[]
        def dfs(step,ans):
            if(step==len(digits)):
                res.append(ans)
                return
            for i in tele[int(digits[step])]:
                dfs(step+1,ans+i)
        dfs(0,"")
        return res
print(Solution().letterCombinations("23"))
print(Solution().letterCombinations("2"))
```
## [组合总和](https://leetcode.cn/problems/combination-sum/description/)
```python
class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        ans=[]
        def dfs(sum,res,cur):
            if(sum==target):
                temp=res.copy()
                ans.append(res)
                return
            for i in range(cur,len(candidates)):
                if(sum+candidates[i]<=target):
                    temp=res.copy()
                    temp.append(candidates[i])
                    dfs(sum+candidates[i],temp,i)
        dfs(0,[],0)
        return ans
print(Solution().combinationSum([2,3,6,7],7))
```
## [分割回文串](https://leetcode.cn/problems/palindrome-partitioning/description/)
```python
class Solution:
    def partition(self, s: str) -> list[list[str]]:
        def check(x):
            if(x==x[::-1]):
                return True
            else:
                return False
        ans=[]
        def dfs(cur,res):
            if(cur==len(s)):
                ans.append(res)
                return
            for i in range(cur,len(s)):
                if(check(s[cur:i+1])):
                    temp=res.copy()
                    temp.append(s[cur:i+1])
                    dfs(i+1,temp)
        dfs(0,[])
        return ans
print(Solution().partition("aab"))
```
