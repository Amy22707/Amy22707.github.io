---
title: 25fall做题记录 - September
description: 2025.9做题记录
publishedAt: 2025-09-12
tags:
  - 算法
  - Python
---
# 2025.9.12
换了pycharm。
## [Sum of Round Numbers](https://codeforces.com/problemset/problem/1352/A)
取每一位数。
* 代码
```python
t=int(input())
for i in range(t):
    a=int(input())
    ans=0
    cnt=0
    res=[]
    while(a>0):
        t=a%10
        if(t!=0):
            res.append(str(t*10**cnt))
            ans+=1
        cnt+=1
        a//=10
    print(ans)
    print(" ".join(res))
```

# 2025.9.13
## [24点](http://cs101.openjudge.cn/pctbook/E18223/)
19年开始学oi到现在还是第一次见五层循环。但是很舒服的思路。
* 代码
```python
m=int(input())
for i in range(m):
    a,b,c,d=map(int,input().split())
    flag=0
    for a0 in (-a,a):
        for b0 in(-b,b):
            for c0 in(-c,c):
                for d0 in(-d,d):
                    if(a0+b0+c0+d0==24):
                        flag=1
                        break
    if(flag==1):
        print("YES")
    else:
        print("NO")
```
## [Candies and Two Sisters](https://codeforces.com/problemset/problem/1335/A)
小学数学题。
* 代码
```python
t=int(input())
for i in range(t):
    a=int(input())
    print((a+1)//2-1)
```
## [Soft Drinking](https://codeforces.com/problemset/problem/151/A)
* 代码
```python
n,k,l,c,d,p,nl,np=map(int,input().split())
a1=k*l/nl
a2=p/np
a3=c*d
print(int(min(a1,a2,a3)//n))
```
## [这一天星期几](http://cs101.openjudge.cn/pctbook/M19944/)
* 代码
```python
n=int(input())
cal=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
for i in range(n):
    a=int(input())
    c=a//1000000
    y=a//10000%100
    m=a%10000//100
    if(m==1 or m==2):
        if(y==0):
            m+=12
            y=99
            c-=1
        else:
            m+=12
            y-=1
    d=a%100
    w=(y+y//4+c//4-2*c+(26*(m+1))//10+d-1)%7
    print(cal[w])
```
## [Odd Divisor](https://codeforces.com/problemset/problem/1475/A)
位运算如此优雅。
* Reference
[Python 如何检查给定的数字是否是2的幂次方](https://geek-docs.com/python/python-ask-answer/848_python_how_to_check_if_a_given_number_is_a_power_of_two.html)
* 代码
```python
t=int(input())
for i in range(t):
    a=int(input())
    print("YES" if a&(a-1) else "NO")
```
# 2025.9.14
## [方便记忆的电话号码](http://cs101.openjudge.cn/pctbook/M01002/)
* 注意点
1.字典的建立、添加元素、排序与遍历
2.特殊情况判断（没有符合要求的情况）
3.字符串转数字要注意，尤其是首位为零的情况。
4.加值之前判断key是否在字典中存在。
* Reference
1.[Python 字典排序](https://geek-docs.com/python/python-dictionary-tutorials/107_python_dictionary_sorting.html)
2.[Python 遍历字典的8种方法](https://zhuanlan.zhihu.com/p/662736698)
3.[Python 判断dict中key是否存在的三种方法](https://blog.csdn.net/little_stick_i/article/details/120987540)
4.[Python字典添加元素的几种方法](https://blog.csdn.net/hdxx2022/article/details/128253047)
* 代码
```python
n=int(input())
tel=[2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,0,7,7,8,8,8,9,9,9,0]
s={}
for i in range(n):
    a=list(input())
    cnt=""
    for j in a:
        if(j>='0' and j<='9'):
            cnt+=j
        elif(j>='A' and j<='Z'):
            cnt+=str(tel[ord(j)-65])
        elif(j>='a' and j<='z'):
            cnt+=str(tel[ord(j)-97])
    if(cnt in s.keys()):
        s[cnt]+=1
    else:
        s[cnt]=1
s={key:s[key] for key in sorted(s)}
flag=0
for i in s.keys():
    if(s[i]>1):
        flag=1
        print("%s-%s %d"%(i[0:3],i[3:7],s[i]))
if(flag==0):
    print("No duplicates.")
```
## [Twins](https://codeforces.com/problemset/problem/160/A)
* 代码
```python
n=int(input())
a=list(map(int,input().split()))
a=sorted(a)[::-1]
s=sum(a)//2+1
cnt=0
for i in range(len(a)):
    cnt+=a[i]
    if(cnt>=s):
        print(i+1)
        break
```
## [Football](https://codeforces.com/problemset/problem/96/A)
* 代码
```python
a=list(input())
cnt=[1]
for i in range(1,len(a)):
    if(a[i]==a[i-1]):
        cnt.append(cnt[i-1]+1)
    else:
        cnt.append(1)
if(max(cnt))>=7:
    print("YES")
else:
    print("NO")
```
## [邮箱验证](http://cs101.openjudge.cn/pctbook/M04015/)
* 注意点
1..strip()去除两端空格
2.列表切片，.index(),.count()
* 代码
```python
while(True):
    try:
        n=list(input().strip())
    except EOFError
        break
    if (n.count("@") != 1):
        print("NO")
        continue
    if (n[0] == '.' or n[0] == '@' or n[-1] == '.' or n[-1] == '@'):
        print("NO")
        continue
    idx = n.index("@")
    if (n[idx + 1] == '.' or n[idx-1]=='.'):
        print("NO")
        continue
    if (n[idx + 1:].count(".") == 0):
        print("NO")
        continue
    print("YES")
```
## [[NOIP 2000 提高组] 乘积最大](https://www.luogu.com.cn/problem/P1018)
区间dp。dp[i][j]定义为将前i位划分j次所得到的最大值。状态转移即为遍历0-i，在某一位再加一个乘号并进行比较。
* Reference
[题解：P1018 [NOIP2000 提高组] 乘积最大](https://www.luogu.com.cn/article/ozeje4jt)
* 代码
```python
n,k=map(int,input().split())
l=input()
dp=[[0 for _ in range(50)]for _ in range(50)]#前i个元素插入j个乘号
for i in range(k+1):
    dp[0][i]=0
for i in range(n):
    dp[i][0]=int(l[:i+1])
for i in range(n):
    for j in range(1,k+1):
        for p in range(i):
            dp[i][j]=max(dp[i][j],dp[p][j-1]*int(l[p+1:i+1]))
maxm=0
for i in range(n):
    if(dp[i][k]>=maxm):
        maxm=dp[i][k]
print(maxm)
```
# 2025.9.15
## [[NOIP 2001 提高组] 统计单词个数](https://www.luogu.com.cn/problem/P1026)
从昨天做到今天。先放个TLE代码
* 注意点
1.![image](https://img2024.cnblogs.com/blog/2669443/202509/2669443-20250915113801273-1042566488.png)
2.![image](https://img2024.cnblogs.com/blog/2669443/202509/2669443-20250915113829326-1566460994.png)
* Reference
1.[C++中substr()函数用法详解](https://blog.csdn.net/weixin_42240667/article/details/103131329)
2.[Python 如何找到一个子字符串的所有出现位置](https://geek-docs.com/python/python-ask-answer/143_python_how_to_find_all_occurrences_of_a_substring.html)
* 代码
```python
def search(x):
    global p,s
    ans=0
    vis=[0 for _ in range(len(a))]
    for i in range(s):
        idx=0
        while(True):
            idx=x.find(dic[i],idx)
            if(idx==-1):
                break
            if(vis[idx]==0):
                vis[idx]=1
                ans+=1
            idx+=1
    return ans
p,k=map(int,input().strip().split())
a=""
dic=[]
for i in range(p):
    a+=input().strip()
s=int(input().strip())
for i in range(s):
    dic.append(input().strip())
dp=[[0 for _ in range(205)] for _ in range(205)]#0-i位插j个隔板
for i in range(len(a)):
    dp[i][0]=search(a[:i+1])
for i in range(k):
    dp[0][i]=0
for i in range(len(a)):
    for j in range(1,k):
        for q in range(j,i):
            dp[i][j]=max(dp[i][j],dp[q][j-1]+search(a[q+1:i+1]))
print(dp[len(a)-1][k-1])
```
本题未完待续。
下午军理课上用pypy3卡过了。由于最后有一个点过不去因此考虑局部优化.
1.把长度小于单词长度的情况跳过。
2.先预处理，把第一个位置拥有的单词标注出来。然后按照位置逐个搜索，有存过就加一。
3.由于字典最多六个单词，使用位运算代替二维数组。第几个单词就在二进制第几位等于一。
* AC代码
```python
def search(left,right):
    global p,s
    ans=0
    for i in range(left,right):
        for j in range(s):
            if(pre[i]&(1<<j) and i+len(dic[j])<=right+1):
                ans+=1
                break
    return ans
p,k=map(int,input().strip().split())
a=""
dic=[]
for i in range(p):
    a+=input().strip()
s=int(input().strip())
for i in range(s):
    dic.append(input().strip())
pre=[0 for _ in range(len(a))]
for j in range(s):
    idx=0
    while(True):
        idx=a.find(dic[j],idx)
        if(idx==-1):
            break
        pre[idx]+=(1<<j)
        idx+=1
dp=[[0 for _ in range(k)] for _ in range(len(a))]#0-i位插j个隔板
for i in range(len(a)):
    dp[i][0]=search(0,i)
for i in range(len(a)):
    for j in range(1,k):
        for q in range(j,i):
            dp[i][j]=max(dp[i][j],dp[q][j-1]+search(q+1,i))
print(dp[len(a)-1][k-1])
```
## [[NOIP 2002 普及组] 选数](https://www.luogu.com.cn/problem/P1036)
1.组合的dfs方法。递降思想，具体来说，按照下标递降，存下当前下标，接下来只选后面的
2.素数筛法改进：如果之前筛过就存起来，避免多次判断。
* 代码
```python
from math import sqrt
def is_prime(x):
    if(x in p):
        return True
    elif(x in np):
        return False
    for i in range(2,int(sqrt(x))+1):
        if(x%i==0):
            np.append(x)
            return False
    p.append(x)
    return True
def dfs(step,start,sum):
    global ans,k
    if(step==k):
        if(is_prime(sum)):
            ans+=1
        return
    for i in range(start,n):
        if(start+k-step>n):
            return
        dfs(step+1,i+1,sum+a[i])
n,k=map(int,input().split())
a=list(map(int,input().split()))
p=[]#prime
np=[]#not prime
ans=0
dfs(0,0,0)
print(ans)
```
## [提取数字](http://cs101.openjudge.cn/pctbook/E02910/)
* 代码
```python
a=input()
cnt=""
flag=0
ans=[]
for i in range(len(a)):
    if(a[i]>='0' and a[i]<='9'):
        if(flag==0):
            ans.append(cnt)
            cnt=a[i]
            flag=1
        else:
            cnt+=a[i]
    else:
        flag=0
ans.append(cnt)
for i in range(1,len(ans)):
    print(int(ans[i]))
```
## [Chips on the Board](https://codeforces.com/contest/1879/problem/B)
贪心。
* 代码
```python
t=int(input())
for i in range(t):
    n=int(input())
    a=list(map(int,input().split()))
    b=list(map(int,input().split()))
    print(min(sum(a)+min(b)*n,sum(b)+min(a)*n))
```
## [[入门赛 #18] 禁止在 int 乘 int 时不开 long long](https://www.luogu.com.cn/problem/P1401)
帮别人debug。
* 代码
```cpp
def check(x,y):
    if(x*y>2147483647 or x*y<-2147483648):
        return True
    else:
        return False
a1,a2=map(int,input().split())
b1,b2=map(int,input().split())
if(check(a1,b1) or check(a1,b2) or check(a2,b1) or check(a2,b2)):
    print("long long int")
else:
    print("int")
```
# 2025.9.16
## [泰波拿契數](http://cs101.openjudge.cn/pctbook/E20742/)
* 代码
```python
a=[0,1,1]
n=int(input())
for i in range(n+1):
    a.append(a[i]+a[i+1]+a[i+2])
print(a[n])
```
## [Chat room](https://codeforces.com/problemset/problem/58/A)
python正则表达式。![image](https://img2024.cnblogs.com/blog/2669443/202509/2669443-20250916215729706-1145687936.png)

* Reference
1.[python——正则表达式(re模块)详解](https://blog.csdn.net/guo_qingxia/article/details/113979135)
2.[Python搜索与匹配绝技：掌握search()和match()从零到高手](https://zhuanlan.zhihu.com/p/648911229)
* 代码
```python
import re
a=input()
print("YES" if re.search('h.*e.*l.*l.*o',a) else "NO")
```
# 2025.9.17
## [Young Physicist](https://codeforces.com/problemset/problem/69/A)
* 代码
```python
n=int(input())
x,y,z=0,0,0
for i in range(n):
    a,b,c=map(int,input().split())
    x+=a
    y+=b
    z+=c
if(x==0 and y==0 and z==0):
    print("YES")
else:
    print("NO")
```
## [水仙花数II](https://sunnywhy.com/sfbj/3/1/60)
* 代码
```python
def check(x):
    a=x//100
    b=x//10%10
    c=x%10
    if(a**3+b**3+c**3==x):
        return True
    else:
        return False
a,b=map(int,input().split())
ans=[]
for i in range(a,b+1):
    if(check(i)):
        ans.append(str(i))
if(len(ans)==0):
    print("NO")
else:
    print(" ".join(ans))
```
## [校门外的树](http://cs101.openjudge.cn/pctbook/E02808/)
* 代码
```python
l,m=map(int,input().split())
tree=[1 for _ in range(l+1)]
for i in range(m):
    a,b=map(int,input().split())
    for j in range(a,b+1):
        tree[j]=0
print(sum(tree))
```
## [Police Recruits](https://codeforces.com/problemset/problem/427/A)
* 代码
```python
n=int(input())
a=list(map(int,input().split()))
ans=0
cur=0
for i in range(n):
    if(a[i]==-1):
        cur-=1
        if(cur<0):
            ans+=1
            cur=0
    else:
        cur+=a[i]
print(ans)
```
# 2025.9.18
## [统计单词数](http://cs101.openjudge.cn/pctbook/M04030/)
不能用split()，因为会出现两个单词之间间隔多个空格的情况。
使用title()，可以使每个单词首字母大写。再给需要搜索的单词后面加上空格，整体判断即可。
看题解还是能学到很多东西的。
* 代码
```python
a=input().strip().title()+' '
t=input().title()+' '
if(t.find(a)!=-1):
    print("%d %d" %(t.count(a),t.find(a)))
else:
    print(-1)
```
## [Fancy Fence](https://codeforces.com/contest/270/problem/A)
小奥题。
* 代码
```python
n=int(input())
for i in range(n):
    t=int(input())
    if(t>=180 or 360%(180-t)!=0):
        print("NO")
    else:
        if(360/(180-t)>=3):
            print("YES")
        else:
            print("NO")
```
## [Lucky Division](https://codeforces.com/contest/122/problem/A)
一开始看错题目WA了。英文题目尤其要仔细看。
大晚上的太急了还写复杂了。为我的莽撞自罚一杯。（已经不知道罚了多少杯了。）
* 代码
```python
a=input()
#lst=['0','1','2','3','5','6','8','9','0']
div=[4,7,44,47,74,77,444,447,474,477,744,747,774,777]
flag=0
for i in div:
    if(int(a)%i==0):
        flag=1
        break
if(flag==1):
    print("YES")
else:
    print("NO")
# else:
#     flag=1
#     for j in lst:
#         if(j in a):
#             flag=0
#             break
#     print("YES" if flag==1 else "NO")
```
# 2025.9.20
## [单调递增序列](https://sunnywhy.com/sfbj/3/1/56)
```python
n=int(input())
a=list(map(int,input().split()))
flag=1
for i in range(n-1):
    if(a[i]>a[i+1]):
        flag=0
        break
if(flag==1):
    print("YES")
else:
    print("NO")
```
## [数学密码](http://cs101.openjudge.cn/pctbook/M21532/)
```python
n=int(input())
for i in range(6,n+1):
    if(n%i==0):
        print(int(n/i))
        break
```
## [大整数加法](http://cs101.openjudge.cn/pctbook/M02981/)
换了C++。复健一下。
```cpp
#include<bits/stdc++.h>
using namespace std;
int max(int a,int b){
    if(a>b){
        return a;
    }
    else{
        return b;
    }
}
int main(){
    char a[205],b[205];
    int a0[205],b0[205],c0[205];
    cin>>a>>b;
    memset(a0,0,sizeof(a0));
    memset(b0,0,sizeof(b0));
    memset(c0,0,sizeof(c0));
    int lena=strlen(a),lenb=strlen(b);
    for(int i=0;i<lena;i++){
        a0[lena-i-1]=a[i]-'0';
    }
    for(int i=0;i<lenb;i++){
        b0[lenb-i-1]=b[i]-'0';
    }
    int s=0,t=0;
    int q;
    for(q=0;q<max(lena,lenb);q++){
        s=t+a0[q]+b0[q];
        c0[q]=s%10;
        t=s/10;
    }
    c0[q]=t;
    int idx;
    for(int i=q+1;i>=0;i--){
        if(c0[i]!=0){
            idx=i;
            break;
        }
    }
    for(int i=idx;i>=0;i--){
        cout<<c0[i];
    }
}
```
## [波兰表达式](http://cs101.openjudge.cn/pctbook/M02694/)
倒着读存栈里。注意保留六位小数。
另外本题可以使用递归完成。
```python
def cal(a,b,s):
    if(s=='+'):
        return a+b
    elif(s=='-'):
        return a-b
    elif(s=='*'):
        return a*b
    elif(s=='/'):
        return a/b
a=list(input().split())
sgn=[]
num=[]
check=['+','-','*','/']
for i in range(len(a)-1,-1,-1):
    if(a[i] in check):
        x=num.pop()
        y=num.pop()
        num.append(cal(x,y,a[i]))
    else:
        num.append(float(a[i]))
print("{:.6f}".format(num[0]))
```
## [十进制到八进制](http://cs101.openjudge.cn/pctbook/M02734/)
开学以来写过最短的代码。
* Reference
[Python 十进制转二进制、八进制、十六进制](https://www.runoob.com/python3/python3-conversion-binary-octal-hexadecimal.html)
```python
a=oct(int(input()))
print(a[2::])
```
# 2025.9.21
## [约瑟夫问题](http://cs101.openjudge.cn/pctbook/M02746/)
模拟。del()函数。
```python
while(True):
    n,m=map(int,input().split())
    if(n==0 and m==0):
        break
    a=[]
    for i in range(1,n+1):
        a.append(i)
    idx=0
    for i in range(n-1):
        num=n-i
        idx=(idx+m-1)%num
        del a[idx]
    print(a[0])
```
## [全排列](http://cs101.openjudge.cn/pctbook/M02748/)
dfs.
python内置permutations.返回一个集合组成的列表。
```python
def dfs(cur):
    global lena,vis
    if(len(cur)==lena):
        res.append(''.join(cur))
        return
    for i in range(lena):
        if(vis[i]==0):
            vis[i]=1
            cur.append(a[i])
            dfs(cur)
            cur.pop()
            vis[i]=0
a=input()
lena=len(a)
vis=[0 for _ in range(lena)]
res=[]
dfs([])
for i in res:
    print(i)
```
```python
from itertools import permutations
a=input()
perms=permutations(a)
for i in sorted(perms):
    print(''.join(i))
```
## [约瑟夫问题No.2](http://cs101.openjudge.cn/pctbook/M03254/)
```python
while(True):
    n,p,m=map(int,input().split())
    if(n==0 and m==0):
        break
    a=[]
    ans=[]
    for i in range(1,n+1):
        a.append(i)
    idx=p-1
    for i in range(n):
        num=n-i
        idx=(idx+m-1)%num
        ans.append(str(a[idx]))
        del a[idx]
    print(",".join(ans))
```
## [数字三角形](http://cs101.openjudge.cn/pctbook/M02760/)
可将dp数组压缩为一维。注意要倒着更新数组，否则可能出现还没加就更新值的情况。
```python
n=int(input())
a=[]
dp=[]
for i in range(n):
    t=list(map(int,input().split()))
    for j in range(len(t),n):
        t.append(0)
    a.append(t)
temp=a[0]
dp=a[0]
for i in range(1,n):
    for j in range(i,0,-1):
        dp[j]=a[i][j]+max(dp[j],dp[j-1])
    dp[0]=a[i][0]+dp[0]
print(max(dp))
```
# 2025.9.22
## [How old are you？](http://cs101.openjudge.cn/pctbook/E21459/)
```python
a=int(input())
while(a!=1):
    if(a%2==1):
        print("%d*3+1=%d" %(a,a*3+1))
        a=a*3+1
    else:
        print("%d/2=%d" %(a,int(a/2)))
        a=a/2
```
## [寻找元素对](https://sunnywhy.com/sfbj/3/2/64)
```python
n=int(input())
a=list(map(int,input().split()))
k=int(input())
ans=0
for i in range(n):
    t=k-a[i]
    if(t in a):
        ans+=1
print(int(ans/2))
```
## [最大子矩阵](http://cs101.openjudge.cn/pctbook/M02766/)
把列压缩，先预处理每一列的前缀和。然后枚举第i-j列，并对每种情况求最大字段和。（Kandane算法）
还是WA。最后发现是一开始的输入有问题，不能将字符串转换为数字，因为可能出现数字有多位、负数的情况。直接使用split()即可。（分隔符，默认为**所有的空字符，包括空格、换行(\n)、制表符(\t)等。**）
* Reference
[最大子矩阵和 = 前缀和 + 最大子段和](https://www.luogu.com.cn/article/bg9zo5cu)
[【基础算法】前缀和、二维前缀和](https://www.cnblogs.com/Tshaxz/p/15235202.html)
[Python split()方法](https://www.runoob.com/python/att-string-split.html)
```python
import sys
n=int(input())
rd=list(map(int,sys.stdin.read().split()))
a=[rd[i*n:(i+1)*n]for i in range(n)]
pre=[[0 for _ in range(n)] for _ in range(n)]
for j in range(n):
    pre[0][j]=a[0][j]
for j in range(n):
    for i in range(1,n):
        pre[i][j]=pre[i-1][j]+a[i][j]#第j列，前i行的和
ans=float('-inf')
dp=[float('-inf') for _ in range(n)]#以i为结尾的最大字段和
dp[0]=pre[0][0]
#print(pre)
for j in range(n):#第0-j行(i=0)
    dp[0]=pre[j][0]
    for k in range(1,n):
        dp[k]=max(dp[k-1]+pre[j][k],pre[j][k])
    #print(dp)
    ans=max(ans,max(dp))
for i in range(1,n):
    for j in range(i,n):#第i-j行
        dp[0]=pre[j][0]-pre[i-1][0]
        for k in range(1,n):
            dp[k]=max(dp[k-1]+pre[j][k]-pre[i-1][k],pre[j][k]-pre[i-1][k])
        #print(dp)
        ans=max(ans,max(dp))
print(ans)
```
## [[AHOI2007] 石块地板](https://www.luogu.com.cn/problem/P7741)
双倍经验。
```python
n,m=map(int,input().split())
a=[]
for i in range(n):
    t=list(input())
    a.append(t)
for i in range(n):
    for j in range(m):
        a[i][j]=int(a[i][j])
        if(a[i][j]==0):
            a[i][j]=-1
pre=[[0 for _ in range(m)] for _ in range(n)]
for j in range(m):
    pre[0][j]=a[0][j]
for j in range(m):
    for i in range(1,n):
        pre[i][j]=pre[i-1][j]+a[i][j]#第j列，前i行的和
ans=float('-inf')
dp=[float('-inf') for _ in range(m)]#以i为结尾的最大字段和
dp[0]=pre[0][0]
#print(pre)
for j in range(n):#第0-j行(i=0)
    dp[0]=pre[j][0]
    for k in range(1,m):
        dp[k]=max(dp[k-1]+pre[j][k],pre[j][k])
    #print(dp)
    ans=max(ans,max(dp))
for i in range(1,n):
    for j in range(i,n):#第i-j行
        dp[0]=pre[j][0]-pre[i-1][0]
        for k in range(1,m):
            dp[k]=max(dp[k-1]+pre[j][k]-pre[i-1][k],pre[j][k]-pre[i-1][k])
        #print(dp)
        ans=max(ans,max(dp))
print(ans)
```
## [采药](http://cs101.openjudge.cn/pctbook/M02773/)
01背包。状态为时间。可以压缩成一维。
```python
t,m=map(int,input().split())
val=[]
time=[]
dp=[[0 for _ in range(t+1)] for _ in range(m)]#放前i个物品，m的时间
for i in range(m):
    x,y=map(int,input().split())
    time.append(x)
    val.append(y)
for i in range(m):
    for j in range(t,0,-1):
        if(j>=time[i]):
            dp[i][j]=max(dp[i-1][j],dp[i-1][j-time[i]]+val[i])
        else:
            dp[i][j]=dp[i-1][j]
ans=0
for i in range(m):
    ans=max(ans,dp[i][t])
print(ans)
```
## [[NOIP 1999 提高组] 导弹拦截](https://www.luogu.com.cn/problem/P1020)
贪心+二分O(nlogn)的LIS做法。存一个数组记录长度为i的LIS中结尾最小的那个数，通过二分可以快速将数加入数组。贪心可得数组的下标即为LIS长度。
通过Dilworth定理可知把序列分成不降子序列的最少个数，等于序列的最长下降子序列长度。
* Reference
[最长上升子序列 (LIS) 详解+例题模板 (全)](https://blog.csdn.net/lxt_Lucia/article/details/81206439)
[P1020 [NOIP 1999 提高组] 导弹拦截 题解](https://www.luogu.com.cn/problem/solution/P1020)
```python
def search1(low,l,r,x):
    while(l<=r):
        mid=(l+r)//2
        if(low[mid]<=x):
            l=mid+1
        else:
            r=mid-1
    return l
def search2(low,l,r,x):
    while(l<=r):
        mid=(l+r)//2
        if(low[mid]<x):
            l=mid+1
        else:
            r=mid-1
    return l
def LIS1():
    global lena
    low=[]  # 长度为i的上升子序列结尾的最小值
    low.append(a[0])
    idx=0
    for i in range(1,lena):
        if(a[i]>=low[idx]):
            idx+=1
            low.append(a[i])
        else:
            low[search1(low,0,idx,a[i])]=a[i]
    return idx+1
def LIS2():
    global lena
    low=[]  # 长度为i的上升子序列结尾的最小值
    low.append(a[0])
    idx=0
    for i in range(1,lena):
        if(a[i]>low[idx]):
            idx+=1
            low.append(a[i])
        else:
            low[search2(low,0,idx,a[i])]=a[i]
    return idx+1
a=list(map(int,input().split()))
lena=len(a)
a=a[::-1]
print(LIS1())
a=a[::-1]
print(LIS2())
```
## [生理周期](http://cs101.openjudge.cn/pctbook/M02977/)
做的时候真傻了。直接末状态-初状态再取模。注意题目中说了排除天数为零的情况。还有输入的数据中有一个变量命名为了i。
```python
p,e,i0,d=map(int,input().split())
for i in range(d+1,21300):
    if((i-p)%23==0 and (i-e)%28==0 and (i-i0)%33==0):
        print(i-d)
        break
```
## [公共子序列](http://cs101.openjudge.cn/pctbook/M02806/)
定义一个二维数组记录两串各自的结尾所对应的LCS长度。注意序列从零开始不好处理，可以在前面加一位。
* Reference
[最长公共子序列 (LCS) 详解+例题模板（全）](https://blog.csdn.net/lxt_Lucia/article/details/81209962)
```python
while True:
    try:
        x,y=input().split()
    except EOFError:
        break
    a=' '+x
    b=' '+y
    lena=len(a)
    lenb=len(b)
    dp=[[0 for _ in range(lenb)] for _ in range(lena)]#a以i结尾，b以j结尾
    ans=0
    for i in range(1,lena):
        for j in range(1,lenb):
            if(a[i]==b[j]):
                dp[i][j]=dp[i-1][j-1]+1
            else:
                dp[i][j]=max(dp[i-1][j],dp[i][j-1])
            ans=max(ans,dp[i][j])
    print(ans)
```
## [Lab杯](http://cs101.openjudge.cn/pctbook/M02992/)
```python
n=int(input())
a=[]
win=[]
for i in range(n):
    a.append(list(map(int,input().split())))
    win.append(a[i].count(3))
print(win.index(max(win))+1)
```
# 2025.9.23
## [登山](http://cs101.openjudge.cn/pctbook/M02995/)
先最长上升子序列再最长下降子序列。考虑直接将序列以i为结尾的LIS长度计算出来，再将序列倒转重复一遍，相当于求出了以i为开头的最长下降子序列。然后对每个i相加求和再求最大值即可。
```python
def LIS(dp):
    global n
    for i in range(1,n):
        for j in range(i):
            if(a[i]>a[j]):
                dp[i]=max(dp[i],dp[j]+1)
n=int(input())
a=list(map(int,input().split()))
ans=0
dp1=[1 for _ in range(n)]
dp2=[1 for _ in range(n)]
LIS(dp1)
a=a[::-1]
LIS(dp2)
dp2=dp2[::-1]
res=[]
for i in range(n):
    res.append(dp1[i]+dp2[i])
print(max(res)-1)
```
## [数论](http://cs101.openjudge.cn/pctbook/E23564/)
分解质因数不需要筛。从小到大除下来就是正确的分解。
```python
n=int(input())
res=[]
for i in range(2,n+1):
    while(n%i==0):
        res.append(i)
        n=n/i
    if(n==1):
        break
if(len(set(res))!=len(res)):
        print(0)
else:
    if(len(res)%2==0):
        print(1)
    else:
        print(-1)
```
## [删除后的最大子数组元素和](https://leetcode.cn/problems/maximum-unique-subarray-sum-after-deletion/description/)
注意特判数组全部为负数的情况。
```python
class Solution:
    def maxSum(self, nums: list[int]) -> int:
        setnum=set(nums)
        ans=0
        flag=0
        for i in setnum:
            if(i>0):
                flag=1
                ans+=i
        if(flag==0):
            return max(setnum)
        return ans
print(Solution().maxSum([1,2,3,4,5]))
print(Solution().maxSum([1,1,0,1,1]))
print(Solution().maxSum([1,2,-1,-2,1,0,-1]))
```
## [《黑神话：悟空》之加密](http://cs101.openjudge.cn/pctbook/E28674/)
写复杂了。可以直接作差取模。
```python
def caesar(c,x):
    if(65<=ord(c)<=90):
        t=ord(c)-x
        while(t<65):
            t+=26
        return chr(t)
    elif(97<=ord(c)<=122):
        t=ord(c)-x
        while(t<97):
            t+=26
        return chr(t)
n=int(input())
a=list(input())
res=[]
for i in range(len(a)):
    res.append(caesar(a[i],n))
print(''.join(res))
```
## [字符串中的整数求和](http://cs101.openjudge.cn/pctbook/E28691/)
```python
a,b=input().split()
print(int(a[:2])+int(b[:2]))
```
## [验证身份证号](http://cs101.openjudge.cn/pctbook/M28664/)
```python
n=int(input())
idx=[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2]
verify=['1','0','X','9','8','7','6','5','4','3','2']
for i in range(n):
    a=list(input())
    ans=0
    for j in range(17):
        ans=(ans+int(a[j])*idx[j])%11
    if(verify[ans]==a[17]):
        print("YES")
    else:
        print("NO")
```
## [罗马数字与整数的转换](http://cs101.openjudge.cn/pctbook/M28700/)
特判题目中提到的特殊情况。阿拉伯数字转罗马数字从大到小整除即可，特殊数值至多出现一次。罗马数字转阿拉伯数字先把特殊数字提出来。
* Reference
[【Python教程】删除字符串中字符的四种方法](https://blog.csdn.net/qdPython/article/details/120510123)
```python
idx = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
r = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
def roman(a):
    ans=''
    for i in range(len(idx)):
        t=a//idx[i]
        if(t>0):
            ans+=r[i]*t
        a-=idx[i]*t
    return ans
def arabic(a):
    ans=0
    for i in range(1,12,2):
        if(r[i] in a):
            ans+=idx[i]
            temp=a.find(r[i])
            a=a[:temp]+a[temp+2:]
    for i in range(0,13,2):
        ans+=a.count(r[i])*idx[i]
    return ans
a=input()
if('0'<=a[0]<='9'):
    print(roman(int(a)))
else:
    print(arabic(a))
```
课上新学了这个。
```python
import math
print(dir(math))
```
## [Taxi](https://codeforces.com/contest/158/problem/B)
```python
n=int(input())
s=list(map(int,input().split()))
ans=0
a=s.count(1)
b=s.count(2)
c=s.count(3)
d=s.count(4)
ans+=d+c
a=max(0,a-c)
ans+=b//2
b%=2
t=b*2+a
ans+=t//4
if(t%4!=0):
    ans+=1
print(ans)
```
上课ak了六道作业。喜提全部一遍过。
![image](https://img2024.cnblogs.com/blog/2669443/202509/2669443-20250923212702855-1109058348.png)
# 2025.9.24
## [蚂蚁王国的越野跑](http://cs101.openjudge.cn/pctbook/T20018/)
归并排序。注意排完之后要把排好的数组赋值回去。
```python
ans=0
def merge(l,r):
    global ans
    mid=(l+r)//2
    if(l==r):
        return
    merge(l,mid)
    merge(mid+1,r)
    i=l
    j=mid+1
    idx=l
    while(i<=mid and j<=r):
        if(a[i]<a[j]):
            ans+=(mid-i+1)
            b[idx]=a[j]
            j+=1
            idx+=1
        else:
            b[idx]=a[i]
            i+=1
            idx+=1
    while(i<=mid):
        b[idx]=a[i]
        idx+=1
        i+=1
    while(j<=r):
        b[idx]=a[j]
        idx+=1
        j+=1
    for i in range(l,r+1):
        a[i]=b[i]
n=int(input())
a=[]
for i in range(n):
    a.append(int(input()))
b = [0 for _ in range(n)]
merge(0,n-1)
print(ans)
```
## [麦森数](http://cs101.openjudge.cn/pctbook/T02706/)
快速幂。把幂次转换为二进制，base定为a的一次方。每次b右移一位并与1按位与，相当于判断b的最后一位是否为1.然后如果为一就乘base，每次操作base都自乘。
```python
import math
mod=10**500
def quickpower(a,b):
    ans=1
    base=a
    while(b>0):
        if(b&1):
            ans*=base
        base*=base
        b>>=1
        ans%=mod
    return ans
p=int(input())
print(int(math.log(2,10)*p)+1)
ans=1
t=quickpower(2,p)-1
t=str(t)
if(len(t)<500):
    t='0'*(500-len(t))+t
for i in range(10):
    print(t[i*50:(i+1)*50])
```
# 2025.9.25
## [买学区房](http://cs101.openjudge.cn/pctbook/M19963/)
statistics模块中的median函数可以直接计算中位数。
如果直接做也不需要结构体排序。开两个数组然后开一个函数各自排序把中位数求出来即可。
* Reference
[Python statistics.median() 方法](https://www.runoob.com/python3/ref-stat-median.html)
```python
import statistics
n=int(input())
pairs=[i[1:-1] for i in input().split()]
distances=[sum(map(int,i.split(',')))for i in pairs]
cost=list(map(int,input().split()))
ave=[distances[i]/cost[i] for i in range(n)]
am=statistics.median(ave)
cm=statistics.median(cost)
ans=0
for i in range(n):
    if(ave[i]>am and cost[i]<cm):
        ans+=1
print(ans)
```
## [2048 Game](https://codeforces.com/problemset/problem/1221/A)
从小到大合成即可。
```python
q=int(input())
s=[1,2,4,8,16,32,64,128,256,512,1024]
for i in range(q):
    n=int(input())
    a=list(map(int,input().split()))
    a=sorted(a)
    if(2048 in a):
        print("YES")
        continue
    idx=0
    while(idx<=10):
        t=a.count(s[idx])
        if(t>1):
            a.remove(s[idx])
            a.remove(s[idx])
            a.append(s[idx]*2)
        else:
            idx+=1
    if(2048 in a):
        print("YES")
    else:
        print("NO")
```
## [计算矩阵边缘元素之和](http://cs101.openjudge.cn/pctbook/E07743/)
特判一行或一列的情况。
```python
m,n=map(int,input().split())
a=[]
ans=0
for i in range(m):
    a.append(list(map(int,input().strip().split())))
if(m==1):
    ans=sum(a[0])
elif(n==1):
    ans=sum(a[i][0] for i in range(m))
else:
    ans+=sum(a[0])+sum(a[m-1])
    for i in range(1,m-1):
        ans+=a[i][0]+a[i][n-1]
print(ans)
```
## [Laptops](https://codeforces.com/contest/456/problem/A)
构建二维数组。按照两个标准分别排一遍序，如果不相等就说明有问题。
* Reference
[Python 如何对二维列表进行排序](https://geek-docs.com/python/python-ask-answer/203_python_how_to_sort_a_2d_list.html)
```python
n=int(input())
a=[]
for i in range(n):
    x=list(map(int,input().split()))
    a.append(x)
if(sorted(a,key=lambda x:x[0])==sorted(a,key=lambda x:x[1])):
    print("Poor Alex")
else:
    print("Happy Alex")
```
## [国王游戏](http://cs101.openjudge.cn/pctbook/T28776/)
贪心。前后两项列式比较，可得出按a*b从小到大排序。直接用二维数组排序即可。
* Reference
[[NOIP 2012 提高组] 国王游戏 题解](https://www.luogu.com.cn/problem/solution/P1080)
```python
n=int(input())
a,b=map(int,input().split())
x=[]
ans=[]
for i in range(n):
    t=list(map(int,input().split()))
    x.append(t)
x=sorted(x,key=lambda t:t[0]*t[1])
ans.append(a//x[0][1])
q=a
for i in range(1,n):
    q*=x[i-1][0]
    ans.append(q//x[i][1])
print(max(ans))
```
# 2025.9.27
## [红蓝玫瑰](http://cs101.openjudge.cn/pctbook/T25573/)
贪心。从后往前，如果是红玫瑰就删了，如果一朵蓝玫瑰就换成蓝玫瑰，如果超过一朵蓝玫瑰就全部反转。
```python
a=input()
ans=0
reverse=1
def check(i):
    global ans,reverse
    if(reverse==1):
        if(a[i]=='B'):
            if(a[i-1]=='R'):
                ans+=1
            else:
                reverse=-1
                ans+=1
    elif(reverse==-1):
        if(a[i]=='R'):
            if(a[i-1]=='B'):
                ans+=1
            else:
                reverse=1
                ans+=1
for i in range(len(a)-1,-1,-1):
    check(i)
print(ans)
```
