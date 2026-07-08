---
title: 26spring做题记录 - March
description: 2026.3做题记录及3月数算月考
publishedAt: 2026-03-01
tags:
  - 算法
  - Python
  - Cpp
  - OOP
  - 随机化
  - 数据结构
---
# 2026.3.1
## [相交链表](https://leetcode.cn/problems/intersection-of-two-linked-lists/description/?envType=study-plan-v2&envId=top-100-liked)
`from typing import Optional`:返回目标类型或None
一个链表为a+c，另一个链表为b+c。走完一个开始走另一个，最终两个指针都走a+b+c，并在相交点相遇。
```python
from typing import Optional
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> Optional[ListNode]:
        if not headA or not headB:
            return None
        pA, pB = headA, headB
        while pA != pB:
            pA = pA.next if pA else headB
            pB = pB.next if pB else headA
        return pA

def create_linked_list(arr):
    if not arr:
        return None
    head = ListNode(arr[0])
    cur = head
    for val in arr[1:]:
        cur.next = ListNode(val)
        cur = cur.next
    return head

a=[4,1,8,4,5]
b=[5,6,1,8,4,5] 
# 注意：这里直接生成的b包含后续节点，但为了模拟相交，我们会把b的尾部截断并接上a的相交部分
headA = create_linked_list(a)
headB = create_linked_list(b[:3]) # 只生成 [5,6,1]

# 模拟相交：相交点是 8
# a中8的位置是索引2 (4->1->8)
intersect_node = headA.next.next 

# 将b的尾部接上相交节点
curB = headB
while curB.next:
    curB = curB.next
curB.next = intersect_node

print(f"Intersect val: {Solution().getIntersectionNode(headA, headB).val}")
```
## [反转链表](https://leetcode.cn/problems/reverse-linked-list/description/?envType=study-plan-v2&envId=top-100-liked)
每次存三个节点。
```python
from typing import Optional
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        cur=head
        if(cur==None):
            return None
        qaq=cur.next
        head.next=None
        while(qaq!=None):
            tmp=qaq.next
            qaq.next=cur
            cur=qaq
            qaq=tmp
        return cur
def init(arr):
    head=ListNode(arr[0])
    cur=head
    for i in range(1,len(arr)):
        cur.next=ListNode(arr[i])
        cur=cur.next
    return head
arr=[1,2,3,4,5]
print(Solution().reverseList(init(arr)).val)
```
## [链表的中间结点](https://leetcode.cn/problems/middle-of-the-linked-list/description/)
两倍速度指针/先扫一遍记录长度
```python
from typing import Optional
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
class Solution:
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
        cur=head
        n=1
        while(cur.next!=None):
            n+=1
            cur=cur.next
        n=n//2
        cur=head
        while(n):
            cur=cur.next
            n-=1
        return cur
```
## [回文链表](https://leetcode.cn/problems/palindrome-linked-list/description/?envType=study-plan-v2&envId=top-100-liked)
先找中点然后反转后半部分。然后双指针同时跑一遍。
```python
from typing import Optional
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
class Solution:
    def reverseList(head):
        cur=head
        if(cur==None):
            return None
        qaq=cur.next
        head.next=None
        while(qaq!=None):
            tmp=qaq.next
            qaq.next=cur
            cur=qaq
            qaq=tmp
        return cur
    def isPalindrome(self, head: Optional[ListNode]) -> bool:
        fast=head
        slow=head
        while(fast.next!=None and fast.next.next!=None):
            slow=slow.next
            fast=fast.next.next
        head2=Solution.reverseList(slow)
        head1=head
        if(head1.val!=head2.val):
            return False
        while(head1.next!=None and head2.next!=None):
            head1=head1.next
            head2=head2.next
            if(head1.val!=head2.val):
                return False
        return True
def init(arr):
    head=ListNode(arr[0])
    cur=head
    for i in range(1,len(arr)):
        cur.next=ListNode(arr[i])
        cur=cur.next
    return head
arr=[1,2,3,2,1]
print(Solution().isPalindrome(init(arr)))
```
## [环形链表](https://leetcode.cn/problems/linked-list-cycle/description/?envType=study-plan-v2&envId=top-100-liked)
哈希表。
```python
from typing import Optional
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None
class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        if(head==None):
            return False
        a=set()
        cur=head
        a.add(cur)
        while(cur.next!=None):
            cur=cur.next
            if(cur in a):
                return True
            a.add(cur)
        return False
```
## [环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/description/?envType=study-plan-v2&envId=top-100-liked)
快慢指针。
```python
from typing import Optional
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        slow=head
        fast=head
        if(fast==None):
            return None
        if(fast.next==None):
            return None
        while(True):
            slow=slow.next
            fast=fast.next.next
            if(fast==None or fast.next==None):
                return None
            if(fast==slow):
                break
        cur=head
        while(slow!=cur):
            slow=slow.next
            cur=cur.next
        return cur
```
## [合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/description/?envType=study-plan-v2&envId=top-100-liked)
```python
from typing import Optional
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        cur1=list1
        cur2=list2
        if(cur1==None and cur2==None):
            return None
        head=ListNode()
        cur3=head
        while(cur1!=None and cur2!=None):
            if(cur1.val>cur2.val):
                cur3.next=cur2
                cur2=cur2.next
                cur3=cur3.next
            else:
                cur3.next=cur1
                cur1=cur1.next
                cur3=cur3.next
        if(cur1!=None):
            cur3.next=cur1
        if(cur2!=None):
            cur3.next=cur2
        return head.next
```
## [删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/description/?envType=study-plan-v2&envId=top-100-liked)
设一个快n-1个结点的指针
```python
from typing import Optional
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        slow=head
        fast=head
        for i in range(n-1):
            fast=fast.next
        # if(fast==None):
        #     return None
        if(fast.next==None):
            tmp=slow.next
            slow.next=None
            return tmp
        while(fast.next.next!=None):
            slow=slow.next
            fast=fast.next
        qaq=slow.next.next
        slow.next=qaq
        return head
```
# 2026.3.2
## [两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs/description/?envType=study-plan-v2&envId=top-100-liked)
设置一个dummy哑节点作为最头上的节点，这样头两个节点就不需要特殊处理。a-b-c变为a-c-b，然后当前节点由a移到b即可。
```python
from typing import Optional
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if(head==None):
            return None
        if(head.next==None):
            return head
        dummy=ListNode(0)
        dummy.next=head
        cur=dummy
        while(cur.next!=None and cur.next.next!=None):
            cur1=cur.next
            cur2=cur.next.next
            cur1.next=cur2.next
            cur2.next=cur1
            cur.next=cur2
            cur=cur1
        return dummy.next
```
## [Fraction类](http://cs101.openjudge.cn/pctbook/E27653/)
1.python自带Fraction类：
```python
from fractions import Fraction
a,b,c,d=map(int,input().split())
x=Fraction(a,b)
y=Fraction(c,d)
print(x+y)
f = Fraction(6, 8)
print(f.numerator, f.denominator) #3 4
```
2.f-string
f"{a}output{b:.2f}" #保留两位小数
3.必须参数：调用时必须提供的参数
默认参数：定义函数时已提供默认值，必须在必须函数后面
```python
def greet(name, age=18, city="北京"):  # age 和 city 有默认值
    print(f"{name} 今年 {age} 岁，住在{city}")

greet("小明")              # 小明 今年 18 岁，住在北京
greet("小红", 20)          # 小红 今年 20 岁，住在北京
greet("小刚", 22, "上海")  # 小刚 今年 22 岁，住在上海
greet("小李", city="广州") # 小李 今年 18 岁，住在广州（指定city参数）
```
可变参数：
*args:任意数量，打包成元组
**kwargs：打包成字典
4.`__add__()`,`__str__()`为特殊方法名，设置后可直接用+，print()调用。
```python
def gcd(a,b):
    a=abs(a)
    b=abs(b)
    if(a<b):
        a,b=b,a
    while(a%b!=0):
        c=a%b
        a=b
        b=c
    return b
class Fraction:
    def __init__(self,numerator,denominator):
        self.numerator=numerator
        self.denominator=denominator
        self.simplify()
    def simplify(self):
        a=self.numerator
        b=self.denominator
        if(a==0):
            self.numerator=0
            self.denominator=1
            return
        c=gcd(a,b)
        self.numerator=a//c
        self.denominator=b//c
    def __add__(self,other):
        a,b,c,d=self.numerator,self.denominator,other.numerator,other.denominator
        e=a*d+b*c
        f=b*d
        return Fraction(e,f)
    def __str__(self):
        a=self.numerator
        b=self.denominator
        if(b==1):
            return f"{a}"
        return f"{a}/{b}"
a,b,c,d=map(int,input().split())
x=Fraction(a,b)
y=Fraction(c,d)
print(x+y)
```
## [模型整理](http://cs101.openjudge.cn/pctbook/M27300/)
1.f-string中的字符串都用单引号括，不然多个双引号会编译报错
2.对精度有要求则可str转decimal.Decimal类型
```python
from collections import defaultdict
from decimal import Decimal
n=int(input())
models=defaultdict(list)
for i in range(n):
    a,b=input().split('-')
    if(b[-1]=='M'):
        c=Decimal(b[0:-1])*1000000
    elif(b[-1]=='B'):
        c=Decimal(b[0:-1])*1000000000
    models[a].append(c)
ans=dict(sorted(models.items(),key=lambda x:x[0]))
for k in ans:
    ans[k].sort()
    tmp=[]
    for i in ans[k]:
        if(i>=1000000 and i<1000000000):
            s=str(i/1000000)
            tmp.append(s+"M")
        else:
            s=str(i/1000000000)
            tmp.append(s+"B")
    print(f"{k}: {', '.join(tmp)}")
```
## [颠倒二进制位](https://leetcode.cn/problems/reverse-bits/description/)
每一次把最后一位放到对应位置（通过将最后一位左移并或运算实现），然后右移一位。
```python
class Solution:
    def reverseBits(self, n: int) -> int:
        ans=0
        for i in range(32):
            if(n==0):
                break
            ans|=((n&1)<<(31-i))
            n=n>>1
        return ans
print(Solution().reverseBits(43261596))
```
O(1)方法：位运算分治。
颠倒的方法是分成两半，颠倒后交换。两半可以继续这么下去。
颠倒的方法是通过与运算取不同的位然后移动。
```python
m0 = 0x55555555  # 01010101 ...
m1 = 0x33333333  # 00110011 ...
m2 = 0x0f0f0f0f  # 00001111 ...
m3 = 0x00ff00ff  # 00000000111111110000000011111111
m4 = 0x0000ffff  # 00000000000000001111111111111111

class Solution:
    def reverseBits(self, n: int) -> int:
        n=(n>>1&m0)|((n&m0)<<1)
        n=(n>>2&m1)|((n&m1)<<2)
        n=(n>>4&m2)|((n&m2)<<4)
        n=(n>>8&m3)|((n&m3)<<8)
        n=(n>>16&m4)|((n&m4)<<16)
        return n
```
# 2026.3.3
## [K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/description/?envType=study-plan-v2&envId=top-100-liked)
每次tail从开头向后移k位。单独翻转后把前后接上。
```python
from typing import Optional
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
class Solution:
    def reverse(self,head,tail):
        cur1=head
        cur2=cur1.next
        while(cur1!=tail):
            cur3=cur2.next
            cur2.next=cur1
            cur1=cur2
            cur2=cur3
        return tail,head
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        dummy=ListNode(0)
        dummy.next=head
        pre=dummy
        while(head):
            head=pre.next
            tail=pre
            for i in range(k):
                tail=tail.next
                if(tail==None):
                    return dummy.next
            tmp=tail.next
            head,tail=Solution().reverse(head,tail)
            pre.next=head
            tail.next=tmp
            pre=tail
        return dummy.next
    def make(self,arr):
        if not arr:
            return None
        head = ListNode(arr[0])
        cur = head
        for val in arr[1:]:
            cur.next = ListNode(val)
            cur = cur.next
        return head
arr=[1,2,3,4,5]
head=Solution().make(arr)
k=3
head=Solution().reverseKGroup(head,k)
while(head):
    print(head.val)
    head=head.next
```
## [奇偶链表](https://leetcode.cn/problems/odd-even-linked-list/description/)
```python
from typing import Optional
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
class Solution:
    def oddEvenList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if(head==None or head.next==None):
            return head
        oddhead=head
        evenhead=head.next
        odd=oddhead
        even=evenhead
        while(even and even.next):
            t1=even.next
            even.next=t1.next
            odd.next=t1
            odd=odd.next
            even=even.next
        odd.next=evenhead
        return head
```
## [随机链表的复制](https://leetcode.cn/problems/copy-list-with-random-pointer/description/?envType=study-plan-v2&envId=top-100-liked)
交叉链表。新点的random就是原点的random的下一个节点。
亦可哈希表。
```python
from typing import Optional
# Definition for a Node.
class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random

class Solution:
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
        cur=head
        if(head==None):
            return None
        while(cur):
            t=Node(cur.val)
            t.next=cur.next
            cur.next=t
            cur=t.next
        cur=head
        while(cur):
            if(cur.random):
                cur.next.random=cur.random.next
            cur=cur.next.next
        newhead=head.next
        cur=head
        newcur=Node(0,head)
        while(cur):
            copy=cur.next
            newcur.next=copy
            cur.next=copy.next
            cur=cur.next
            newcur=newcur.next
        return newhead
```
## [排布二进制网格的最少交换次数](https://leetcode.cn/problems/minimum-swaps-to-arrange-a-binary-grid/description/)
由于越往下需要满足的条件越宽松，因此对每行向下遍历，遇到符合条件的就交换上去。
```python
class Solution:
    def minSwaps(self, grid: list[list[int]]) -> int:
        n=len(grid)
        zeroes=[n]*n
        for i in range(n):
            for j in range(n-1,-1,-1):
                if(grid[i][j]==1):
                    zeroes[i]=n-1-j
                    break
        ans=0
        for i in range(n):
            qaq=n-1-i
            flag=0
            for j in range(i,n):
                if(zeroes[j]>=qaq):
                    flag=1
                    ans+=(j-i)
                    zeroes[i+1:j+1]=zeroes[i:j]
                    break
            if(flag==0):
                return -1
        return ans
print(Solution().minSwaps([[0,0,1],[1,1,0],[1,0,0]]))
```
## [最大点数（同2048规则）](http://cs101.openjudge.cn/pctbook/T20052/)
直接搜索即可。
模拟的时候注意不要更改原数组，数据量较低使用deepcopy即可。先把所有数字移到一边（移动零），再合并，再移动零。
```python
from copy import deepcopy
m,n,p=map(int,input().split())
def left(b):
    a=deepcopy(b)
    global m,n
    for i in range(m):
        cur=0
        for j in range(n):
            if(a[i][j]!=0):
                a[i][cur],a[i][j]=a[i][j],a[i][cur]
                cur+=1
        for j in range(n):
            if(a[i][j]!=0 and j!=n-1 and a[i][j]==a[i][j+1]):
                a[i][j]*=2
                a[i][j+1]=0
        cur=0
        for j in range(n):
            if(a[i][j]!=0):
                a[i][cur],a[i][j]=a[i][j],a[i][cur]
                cur+=1
    return a
def right(b):
    a=deepcopy(b)
    global m,n
    for i in range(m):
        cur=n-1
        for j in range(n-1,-1,-1):
            if(a[i][j]!=0):
                a[i][cur],a[i][j]=a[i][j],a[i][cur]
                cur-=1
        for j in range(n-1,-1,-1):
            if(a[i][j]!=0 and j!=0 and a[i][j]==a[i][j-1]):
                a[i][j]*=2
                a[i][j-1]=0
        cur=n-1
        for j in range(n-1,-1,-1):
            if(a[i][j]!=0):
                a[i][cur],a[i][j]=a[i][j],a[i][cur]
                cur-=1
    return a
def up(b):
    a=deepcopy(b)
    global m,n
    for j in range(n):
        cur=0
        for i in range(m):
            if(a[i][j]!=0):
                a[cur][j],a[i][j]=a[i][j],a[cur][j]
                cur+=1
        for i in range(m):
            if(a[i][j]!=0 and i!=m-1 and a[i][j]==a[i+1][j]):
                a[i][j]*=2
                a[i+1][j]=0
        cur=0
        for i in range(m):
            if(a[i][j]!=0):
                a[cur][j],a[i][j]=a[i][j],a[cur][j]
                cur+=1
    return a
def down(b):
    a=deepcopy(b)
    global m,n
    for j in range(n):
        cur=m-1
        for i in range(m-1,-1,-1):
            if(a[i][j]!=0):
                a[cur][j],a[i][j]=a[i][j],a[cur][j]
                cur-=1   
        for i in range(m-1,-1,-1):
            if(a[i][j]!=0 and i!=0 and a[i][j]==a[i-1][j]):
                a[i][j]*=2
                a[i-1][j]=0
        cur=m-1
        for i in range(m-1,-1,-1):
            if(a[i][j]!=0):
                a[cur][j],a[i][j]=a[i][j],a[cur][j]
                cur-=1   
    return a    
def dfs(a,step):
    global ans,m,n,p
    # print("TEST",step)
    # for i in range(m):
    #     for j in range(n):
    #         print(a[i][j],end=' ')
    #     print()
    if(step==p):
        res=0
        for i in range(m):
            for j in range(n):
                res=max(res,a[i][j])
        ans=max(ans,res)
        return
    dfs(left(a),step+1)
    dfs(right(a),step+1)
    dfs(up(a),step+1)
    dfs(down(a),step+1)
    return
a=[]
ans=0
for i in range(m):
    t=list(map(int,input().split()))
    a.append(t)
dfs(a,0)
print(ans)
```
# 2026.3.5
## [max-cut近似](http://cssyb.openjudge.cn/26hw2/1/)
随机选点，α=2.
直接存边。
`srand(time(0));`
`rand()%2`->以0.5概率决定。
```cpp
#include<bits/stdc++.h>
using namespace std;
struct Edge{
    int u,v;
};
int main(){
    srand(time(0));
    int qaq;
    cin>>qaq;
    while(qaq--){
        int n,m;
        cin>>n>>m;
        vector<Edge> edges(m);
        for(int i=0;i<m;i++){
            int u,v;
            cin>>u>>v;
            edges[i].u=u;
            edges[i].v=v;
        }
        int ans=0;
        vector<bool> s(n+1);
        vector<bool> s0(n+1);
        for(int t=0;t<100;t++){
            int res=0;
            for(int i=1;i<=n;i++){
                if(rand()%2==0) s[i]=1;
                else s[i]=0;
            }
            for(int i=0;i<m;i++){
                if(s[edges[i].u]^s[edges[i].v]==1) res++;
            }
            if(res>ans){
                s0=s;
                ans=res;
            }
        }
        set<int> st;
        for(int i=1;i<=n;i++){
            if(s0[i]==1){
                st.insert(i);
            }
        }
        cout<<st.size()<<endl;
        for(int x : st){
            cout<<x<<" ";
        }
        cout<<endl;
    }
    return 0;
}
```
## [连接连续二进制数字](https://leetcode.cn/problems/concatenation-of-consecutive-binary-numbers/description/)
连接=左移若干位然后或运算。
`.bit_length()`返回二进制的位数
```python
class Solution:
    def concatenatedBinary(self, n: int) -> int:
        ans=0
        mod=1000000007
        for i in range(1,n+1):
            t=i.bit_length()
            ans=(ans<<t)|i
            ans%=mod
        return ans
print(Solution().concatenatedBinary(3))
```
## [二进制间距](https://leetcode.cn/problems/binary-gap/description/)
```python
class Solution:
    def binaryGap(self, n: int) -> int:
        ans=0
        cnt=1
        flag=0
        while(n):
            if(flag==1 and n&1==0):
                cnt+=1
            elif(n&1==1):
                if(flag==0):
                    flag=1
                else:
                    ans=max(ans,cnt)
                    cnt=1
            n>>=1
        return ans
print(Solution().binaryGap(5))
```
## [将二进制表示减到 1 的步骤数](https://leetcode.cn/problems/number-of-steps-to-reduce-a-number-in-binary-representation-to-one/description/)
[四行代码，直观了解背后原理](https://leetcode.cn/problems/number-of-steps-to-reduce-a-number-in-binary-representation-to-one/solutions/3908562/si-xing-dai-ma-zhi-guan-liao-jie-bei-hou-1fhs/)
连续的1进位最后会多一次操作，而连续的1的个数相当于头尾的1之间0的个数。答案即为n+1+cnt。
```python
class Solution:
    def numSteps(self, s: str) -> int:
        n=len(s)
        idx=s[::-1].find('1')
        if(idx==n-1):
            return n-1
        idx=n-1-idx
        ans=n+1
        for i in range(0,idx):
            if(s[i]=='0'):
                ans+=1
        return ans
print(Solution().numSteps("1101"))
```
## [统计单比特整数](https://leetcode.cn/problems/count-monobit-integers/description/)
bit_count():1的个数
bit_length():二进制长度
```python
class Solution:
    def countMonobit(self, n: int) -> int:
        t=n.bit_length()
        ans=t
        if(n.bit_count()==n.bit_length()):
            ans+=1
        return ans
print(Solution().countMonobit(4))
```
## [检查一个字符串是否包含所有长度为 K 的二进制子串](https://leetcode.cn/problems/check-if-a-string-contains-all-binary-codes-of-size-k/description/)
思路是把字符串中每个长度为k的字串加入集合中。可以使用滑动窗口，集合中存十进制数，这样可以根据上一个数更新下一个。
```python
class Solution:
    def hasAllCodes(self, s: str, k: int) -> bool:
        n=len(s)
        st=set()
        if(k>n):
            return False
        num=int(s[:k],2)
        st.add(num)
        for i in range(k,n):
            num=(num-(int(s[i-k])<<(k-1)))*2+int(s[i])
            st.add(num)
        return len(st)==(1<<k)
print(Solution().hasAllCodes("00110110", 2))
```
## [多项式加法](http://cs101.openjudge.cn/practice/05467/)
defaultdict(int)
d.items()
两个多项式不一定一样长。
```python
from collections import defaultdict
qaq=int(input())
for _ in range(qaq):
    a=list(map(int,input().split()))
    b=list(map(int,input().split()))
    n=len(a)
    n//=2
    m=len(b)
    m//=2
    d=defaultdict(int)
    for i in range(n):
        if(a[2*i+1]<0):
            break
        d[a[2*i+1]]+=a[2*i]
    for i in range(m):
        if(b[2*i+1]<0):
            break
        d[b[2*i+1]]+=b[2*i]
    ans=dict(sorted(d.items(),key=lambda x:-x[0]))
    res=[]
    for k,v in ans.items():
        if(v==0):
            continue
        res.append(f"[ {v} {k} ]")
    print(" ".join(res))
```
## [Number Sequence](http://cs101.openjudge.cn/practice/01019/)
1.取数位个数：len(str(i)),取对数可能有精度问题。
2.bisect_left：大于等于,bisect：大于
3.取数中的某一位：转成字符串。
```python
from math import log
from bisect import bisect_left
t=int(input())
digit=[0]*35000
sum=[0]*35000
sum[1]=1
pre=[0,1]
for i in range(1,35000):
    digit[i]=len(str(i))
for i in range(2,35000):
    sum[i]=sum[i-1]+digit[i]
    pre.append(pre[i-1]+sum[i])
for _ in range(t):
    n=int(input())
    ans=bisect_left(pre,n)
    tmp=n-pre[ans-1]
    for i in range(1,ans+1):
        tmp-=digit[i]
        if(tmp<=0):
            tmp+=digit[i]
            print(str(i)[tmp-1])
            break
```
# 2026.3.7
## [Fingerprinting](http://cssyb.openjudge.cn/26hw3/1/)
随机生成[0,1]的列向量，与两边相乘，复杂度减为O(n^2).比对生成的矩阵的指纹是否相同。
```cpp
#include<bits/stdc++.h>
using namespace std;
int randint(const unsigned int &seed) {
    static unsigned int x = seed;
    x = (x * 23333LL + 23327) % 1000000007;
    return x % 20 - 10;
}
int a[3005][3005],b[3005][3005],c[3005][3005];
long long a0[3005],b0[3005],c0[3005];
int main(){
    int n,seed;
    scanf("%d",&n);
    scanf("%d",&seed);
    for(int i = 1; i <= n; i ++){
        for(int j = 1; j <= n;j++) {
            a[i][j] = randint(seed);
            b[i][j] = randint(seed);
        }
    }
    for(int i=1;i<=n;i++){
        for(int j=1;j<=n;j++){
            scanf("%d",&c[i][j]);
        }
    }
    int d[n+1];
    minstd_rand gen;
    bool flag=1;
    for(int k=1;k<=2;k++){
        for(int i=1;i<=n;i++){
            d[i]=gen()&1;
        }
    memset(a0,0,sizeof(a0));
    memset(b0,0,sizeof(b0));
    memset(c0,0,sizeof(c0));
        for(int i=1;i<=n;i++){
            for(int j=1;j<=n;j++){
                b0[i]+=b[i][j]*d[j];
            }
        }
        for(int i=1;i<=n;i++){
            for(int j=1;j<=n;j++){
                c0[i]+=c[i][j]*d[j];
            }
        }
        for(int i=1;i<=n;i++){
            for(int j=1;j<=n;j++){
                a0[i]+=a[i][j]*b0[j];
            }
        }
        for(int i=1;i<=n;i++){
            if(a0[i]!=c0[i]){
                flag=0;
                break;
            }
        }
    }
    if(flag) printf("YES\n");
    else printf("NO \n");
    return 0;
}
```
## [排队](http://cs101.openjudge.cn/practice/20169/)
```python
t=int(input())
def find(x):
    if(x==fa[x]):
        return x
    fa[x]=find(fa[x])
    return fa[x]
def merge(x,y):
    if(find(x)!=find(y)):
        fa[find(x)]=find(y)
for _ in range(t):
    n,m=map(int,input().split())
    fa=[_ for _ in range(n+1)]
    for i in range(m):
        x,y=map(int,input().split())
        merge(x,y)
    ans=[]
    for i in range(1,n+1):
        ans.append(find(i))
    print(" ".join(map(str,ans)))
```
# 2026.3.9
## [区域和检索 - 数组不可变](https://leetcode.cn/problems/range-sum-query-immutable/description/)
```python
class NumArray:

    def __init__(self, nums: list[int]):
        n=len(nums)
        sum=[0]*(n+1)
        for i in range(n):
            sum[i+1]=sum[i]+nums[i]
        self.sum=sum
    def sumRange(self, left: int, right: int) -> int:
        return self.sum[right+1]-self.sum[left]

# Your NumArray object will be instantiated and called as such:
# obj = NumArray(nums)
# param_1 = obj.sumRange(left,right)
obj=NumArray([-2, 0, 3, -5, 2, -1])
print(obj.sumRange(0, 2))
print(obj.sumRange(2, 5))
print(obj.sumRange(0, 5))
```
## [找出第 N 个二进制字符串中的第 K 位](https://leetcode.cn/problems/find-kth-bit-in-nth-binary-string/description/)
递归，分析是在前半还是后半，然后推到n-1.
```python
class Solution:
    def findKthBit(self, n: int, k: int) -> str:
        if(n==1):
            return '0'
        if(k==(1<<(n-1))):
            return '1'
        if(k<(1<<(n-1))):
            return self.findKthBit(n-1,k)
        res=self.findKthBit(n-1,(1<<n)-k)
        if(res=='1'):
            return '0'
        else:
            return '1'
print(Solution().findKthBit(3, 1))
```
# 2026.3.10
数算课
1.真值表
## [二维区域和检索 - 矩阵不可变](https://leetcode.cn/problems/range-sum-query-2d-immutable/description/)
```python
class NumMatrix:
    def __init__(self, matrix: list[list[int]]):
        m=len(matrix)
        n=len(matrix[0])
        sum=[[0 for _ in range(n+1)]for _ in range(m+1)]
        for i in range(m):
            for j in range(n):
                sum[i+1][j+1]=sum[i+1][j]+sum[i][j+1]+matrix[i][j]-sum[i][j]
        self.sum=sum
    def sumRegion(self, row1: int, col1: int, row2: int, col2: int) -> int:
        return self.sum[row2+1][col2+1]-self.sum[row2+1][col1]-self.sum[row1][col2+1]+self.sum[row1][col1]


# Your NumMatrix object will be instantiated and called as such:
# obj = NumMatrix(matrix)
# param_1 = obj.sumRegion(row1,col1,row2,col2)
obj=NumMatrix([[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]])
print(obj.sumRegion(2, 1, 4, 3))
print(obj.sumRegion(1, 1, 2, 2))
print(obj.sumRegion(1, 2, 2, 4))
```
## [区域和检索 - 数组可修改](https://leetcode.cn/problems/range-sum-query-mutable/description/)
树状数组。
[【模板】树状数组 1](https://www.luogu.com.cn/problem/P3374)
单点修改，区间查询。
如果区间修改，单点查询，则使用差分数组。
[【模板】树状数组 2](https://www.luogu.com.cn/problem/P3368)
```python
class NumArray:

    def __init__(self, nums: list[int]):
        n=len(nums)
        self.num=nums
        self.tree=[0]*(n+1)
        for i in range(n):
            self.add(i+1,nums[i])
    def lowbit(x):
        return x&(-x)
    def add(self,idx,val):
        while(idx<len(self.tree)):
            self.tree[idx]+=val
            idx+=NumArray.lowbit(idx)
    def prefix(self,index):
        ans=0
        while(index>0):
            ans+=self.tree[index]
            index-=NumArray.lowbit(index)
        return ans
    def update(self, index: int, val: int) -> None:
        self.add(index+1,val-self.num[index])
        self.num[index]=val

    def sumRange(self, left: int, right: int) -> int:
        return self.prefix(right+1)-self.prefix(left)


# Your NumArray object will be instantiated and called as such:
# obj = NumArray(nums)
# obj.update(index,val)
# param_2 = obj.sumRange(left,right)
obj=NumArray([1,3,5])
print(obj.sumRange(0,2))
obj.update(1,2)
print(obj.sumRange(0,2))
```
## [回文子串](https://leetcode.cn/problems/palindromic-substrings/description/)
中心扩散法。长度为n的字符串产生2n-1个回文中心[l,r]。
```python
class Solution:
    def countSubstrings(self, s: str) -> int:
        n=len(s)
        ans=0
        for i in range(2*n-1):
            l=i//2
            r=(i+1)//2
            while(l>=0 and r<n and s[l]==s[r]):
                l-=1
                r+=1
                ans+=1
        return ans
print(Solution().countSubstrings("abc"))
```
## [XXXXX](https://codeforces.com/problemset/problem/1364/A)
双指针。需要两头加起来不是x的倍数（否则整体不是x的倍数），因此必有一头符合。只删一头即可。
```python
def doit(n,x,a):
    s=sum(a)
    if(s%x!=0):
        return n
    else:
        i=0
        j=n-1
        si=sj=0
        while(i<n and j>=0):
            si+=a[i]
            sj+=a[j]
            if(si%x!=0 or sj%x!=0):
                return j
            i+=1
            j-=1
    return -1
t=int(input())
for _ in range(t):
    n,x=map(int,input().split())
    a=list(map(int,input().split()))
    print(doit(n,x,a))
```
# 2026.3.11 月考及练习
## [生成概率为p的两点分布](http://cssyb.openjudge.cn/26hw4/1/)
![image](https://img2024.cnblogs.com/blog/2669443/202603/2669443-20260311143328723-1990324558.png)
每次乘二后减一，以防p=1及整数溢出。
```cpp
#include <iostream>
#include <cassert>
#include <random>
using namespace std;
const int T = 1e6;
const double eps = 1e-2;
random_device rd;
class Generator{
    private:
        minstd_rand gen;
    public:
        int rand(){ return gen() % 2; }
};
int bern(double p, Generator *G){
// 在此处补充你的代码
    while(true){
        p*=2.0;
        int ans=p>=1.0?1:0;
        int qaq=G->rand();
        p-=ans;
        if(qaq==ans){
            return ans;
        }
    }
}
int main(){
    double p; int T;
    while (cin >> p >> T){
        Generator RAND, CHECK;
        int tmp = bern(p, &CHECK);
        for (int i = 1; i <= T; ++ i){
            Generator CHECK;
            if (tmp != bern(p, &CHECK)){
            //    cout << "using external randomness!" << endl;
                cout << "WA" << endl;
                return 0;
            }
        }
        int c = 0;
        for (int i = 1; i <= T; ++ i)
            c += bern(p, &RAND);
    //    cout << "the frequncy is : " << (double)c / T << endl;
        if (c < (p - eps) * T || c > (p + eps) * T){
            cout << "WA" << endl;
            return 0;
        }
    }
    cout << "AC" << endl;
    return 0;
}
```
## [十进制整数的反码](https://leetcode.cn/problems/complement-of-base-10-integer/description/)
```python
class Solution:
    def bitwiseComplement(self, n: int) -> int:
        t=n.bit_length()
        return n^((1<<t)-1) if n>0 else 1
print(Solution().bitwiseComplement(5))
```
从上学期就开始说的打比赛不要急是什么意思！
就是T2被卡了，以及T6交的前两发输出格式都不对。
## [泰波拿契數](http://cs101.openjudge.cn/20260311mockexam/E20742/)
```python
n=int(input())
a=[0,1,1]
for i in range(3,n+1):
    a.append(a[i-1]+a[i-2]+a[i-3])
print(a[n])
```
## [稳定的符文序列](http://cs101.openjudge.cn/20260311mockexam/E29950/)
滑动窗口。每次只有右指针新添加的会影响，右移一位左移若干位。
```python
s=input()
n=len(s)
a=[0]*26
t=set()
left=0
ans=0
cur=0
for i in range(n):
    a[ord(s[i])-ord('a')]+=1
    cur+=1
    while(a[ord(s[i])-ord('a')]>1):
        a[ord(s[left])-ord('a')]-=1
        cur-=1
        left+=1
    ans=max(ans,cur)
print(ans)
```
## [十进制整数的反码](http://cs101.openjudge.cn/20260311mockexam/E30571/)
```python
n=int(input())
t=bin(n)[2:]
ans=""
for i in range(len(t)):
    if(t[i]=='0'):
        ans+='1'
    else:
        ans+='0'
print(int(ans,2))
```
亦可创建全1掩码然后按位异或。
## [Ultra-QuickSort](http://cs101.openjudge.cn/20260311mockexam/M02299/)
求逆序对。
```python
ans=0
def merge(l,r):
    global ans
    if(l==r):
        return
    mid=(l+r)>>1
    merge(l,mid)
    merge(mid+1,r)
    i=l
    j=mid+1
    cur=l
    while(i<=mid and j<=r):
        if(a[i]>a[j]):
            ans+=(mid-i+1)
            a_new[cur]=a[j]
            cur+=1
            j+=1
        else:
            a_new[cur]=a[i]
            cur+=1
            i+=1
    while(i<=mid):
        a_new[cur]=a[i]
        cur+=1
        i+=1
    while(j<=r):
        a_new[cur]=a[j]
        cur+=1
        j+=1
    a[l:r+1]=a_new[l:r+1]
while(True):
    n=int(input())
    if(n==0):
        break
    a=[]
    ans=0
    a_new=[0]*n
    for i in range(n):
        t=int(input())
        a.append(t)
    merge(0,n-1)
    print(ans)
```
## [逃离紫罗兰监狱](http://cs101.openjudge.cn/20260311mockexam/M29954/)
```python
from collections import deque
r,c,k=map(int,input().split())
a=[]
for i in range(r):
    t=input()
    a.append(t)
for i in range(r):
    for j in range(c):
        if(a[i][j]=='S'):
            x0=i
            y0=j
        elif(a[i][j]=='E'):
            x1=i
            y1=j
q=deque()
vis=[[[0 for _ in range(k+1)]for _ in range(c)]for _ in range(r)]
q.append([x0,y0,0,0])
vis[x0][y0][0]=1
dx=[0,1,0,-1]
dy=[1,0,-1,0]
flag=0
while(q):
    x,y,cur,l=q.popleft()
    if(flag==1):
        break
    for i in range(4):
        xx=x+dx[i]
        yy=y+dy[i]
        if(xx>=0 and xx<r and yy>=0 and yy<r):
            if(a[xx][yy]=='.'):
                if(vis[xx][yy][cur]==0):
                    vis[xx][yy][cur]=1
                    q.append([xx,yy,cur,l+1])
            elif(a[xx][yy]=='#'):
                if(cur<k and vis[xx][yy][cur+1]==0):
                    vis[xx][yy][cur+1]=1
                    q.append([xx,yy,cur+1,l+1])
            elif(a[xx][yy]=='E'):
                flag=1
                print(l+1)
                break
if(flag==0):
    print(-1)
```
## [狭路相逢](http://cs101.openjudge.cn/20260311mockexam/M30218/)
注意审题，幸存者包括人和怪。因此使用栈，幸存的怪一定在栈底。
```python
from collections import deque
n=int(input())
a=list(map(int,input().split()))
s=deque()
for i in range(n):
    if(a[i]>0):
        s.append(a[i])
    else:
        tmp=-a[i]
        while(s):
            t=s[-1]
            if(t<0):
                break
            s.pop()
            if(t>tmp):
                t-=tmp
                s.append(t)
                tmp=0
                break
            else:
                tmp-=t
        if(tmp>0):
            s.append(-tmp)
print(len(s))
print(" ".join(map(str,s)))
```
# 2026.3.12
## [估计p分位数](http://cssyb.openjudge.cn/26hw5/1/)
```cpp
#include <bits/stdc++.h>
#include "rank.h"
using namespace std;
int rnk(int n, double p){
    minstd_rand gen;
    int res[n+1];
    int m=4000;
    for(int i=0;i<m;i++){
        int t=int(double(gen())/gen.max()*n)+1;
        res[i]=query(t);
    }
    sort(res,res+m);
    int idx=int(p*m);
    if(idx<0) idx=0;
    if(idx>=m) idx=m-1;
    return res[idx];
}
```
## [数字华容道（Easy Version）](http://cs101.openjudge.cn/practice/30178/)
左右移动不改变序列奇偶性，上下移动相当于移动(n-1)位，如果n为偶数影响奇偶性，n为奇数则不影响。
因此转化为求整条序列的逆序对。这里采用树状数组。
先把所有数离散化为1-n(这道题不需要)，然后从后往前遍历。对当前元素x，答案加上tree[x-1]（即在此之前遇到过的小于x的数），然后在tree的x对应位置+1，表示已经遇到过了。
```python
def lowbit(x):
    return x&(-x)
class BIT:
    def __init__(self,n):
        self.n=n
        self.tree=[0]*(n+1)
    def update(self,idx,x):
        while(idx<=self.n):
            self.tree[idx]+=x
            idx+=lowbit(idx)
    def query(self,idx):
        ans=0
        while(idx>0):
            ans+=self.tree[idx]
            idx-=lowbit(idx)
        return ans
n=int(input())
a=[]
for i in range(n):
    t=list(map(int,input().split()))
    if(0 in t):
        tmp=i
        t.remove(0)
    a.extend(t)
m=n*n-1
b=BIT(m)
ans=0
for i in range(m-1,-1,-1):
    ans+=b.query(a[i]-1)
    b.update(a[i],1)
if(n%2==0):
    ans+=(n-tmp-1)
    if(ans%2==0):
        print("yes")
    else:
        print("no")
else:
    if(ans%2==0):
        print("yes")
    else:
        print("no")
```
## [数字华容道（Hard Version）](http://cs101.openjudge.cn/practice/30179/)
求全排列序列的奇偶性，即求把它还原成1-n正序的交换次数。全排列可以唯一分解为多个循环。一个有 n 个数的循环可以通过 n-1 次元素交换变回递增的序列。
```python
T=int(input())
def cycle(a):
    m=len(a)
    vis=bytearray(m)
    ans=0
    for i in range(m):
        if(not vis[i]):
            res=0
            j=i
            while(not vis[j]):
                vis[j]=1
                j=a[j]-1
                res+=1
            ans=(ans+res-1)&1
    return ans
for _ in range(T):
    n=int(input())
    a=[]
    tmp=1
    for i in range(n):
        t=list(map(int,input().split()))
        if(0 in t):
            t.remove(0)
            if(n%2==0):
                tmp=i
        a.extend(t)
    if((cycle(a)+tmp)&1):
        print("yes")
    else:
        print("no")
```
# 2026.3.15
## [Idiot First Search](https://codeforces.com/problemset/problem/2195/E)
拖了三天的题目。
树上dp.dp数组记录每个点向下一趟之后回到原来的点的代价。dp[root]=(dp[l]+1)+(dp[r]+1)+1=dp[l]+dp[r]+3.这里使用后序遍历可以完成更新。
然后使用前序遍历记录每个点的答案。res[i]=dp[i]+res[parent].
由于递归爆栈需要使用stack手动模拟。后序遍历使用双栈。stack按根左右压入，每次把根压入新栈，这样新栈是根右左的顺序。然后倒着遍历栈，就是左右根的顺序。
```python
import sys
mod=1000000007
# sys.setrecursionlimit(10**7)
# def postorder(root):
#     if(left[root]==0 and right[root]==0):
#         dp[root]=1
#         return 1
#     l,r=left[root],right[root]
#     postorder(l)
#     postorder(r)
#     dp[root]=(dp[l]+dp[r]+3)%mod
# def preorder(root,parent_res):
#     res[root]=(dp[root]+parent_res)%mod
#     l,r=left[root],right[root]
#     if(l==0 and r==0):
#         return
#     preorder(l,res[root])
#     preorder(r,res[root])
T=int(input())
for _ in range(T):
    n=int(input())
    left=[0]*(n+1)
    right=[0]*(n+1)
    dp=[0]*(n+1)
    res=[0]*(n+1)
    for i in range(1,n+1):
        l,r=map(int,input().split())
        left[i]=l
        right[i]=r
    #postorder(1)
    stack=[1]
    vis_order=[]
    while(stack):
        u=stack.pop()
        if(u==0):
            continue
        vis_order.append(u)
        stack.append(left[u])
        stack.append(right[u])#根右左
    for u in reversed(vis_order):
        l,r=left[u],right[u]
        if(l==0 and r==0):
            dp[u]=1
        else:
            dp[u]=(dp[l]+dp[r]+3)%mod
    #preorder(1,0)
    res[1]=dp[1]
    stack=[1]
    while(stack):
        u=stack.pop()
        l,r=left[u],right[u]
        if(l==0 and r==0):
            continue
        if(l!=0):
            res[l]=(dp[l]+res[u])%mod
            stack.append(l)
        if(r!=0):
            res[r]=(dp[r]+res[u])%mod
            stack.append(r)
    print(" ".join(map(str,res[1:n+1])))
```
## [使二进制字符串字符交替的最少反转次数](https://leetcode.cn/problems/minimum-number-of-flips-to-make-the-binary-string-alternating/description/)
首位放到最后和01变化的顺序不影响。因此先01变化，对长度为偶数的数列来说就够了。对奇数来说，考虑是否需要首位移动。首位移动到最后，相当于把字符串和自己拼一起，并以长度为n的窗口滑动。每次移动时减去前一位对cnt的贡献，加上新的一位对cnt的贡献。实时更新每个窗口的ans，取最小值。
```python
class Solution:
    def minFlips(self, s: str) -> int:
        target="01"
        n=len(s)
        cnt=0
        for i in range(n):
            if(s[i]!=target[i%2]):
                cnt+=1
        ans=min(cnt,n-cnt)
        s+=s
        for i in range(1,n):
            if(s[i-1]!=target[(i-1)%2]):
                cnt-=1
            if(s[i+n-1]!=target[(i+n-1)%2]):
                cnt+=1
            ans=min(ans,cnt,n-cnt)
        return ans
print(Solution().minFlips("111000"))
```
# 2026.3.16
## [长度为 n 的开心字符串中字典序第 k 小的字符串](https://leetcode.cn/problems/the-k-th-lexicographical-string-of-all-happy-strings-of-length-n/description/)
```python
class Solution:
    def getHappyString(self, n: int, k: int) -> str:
        if(k>3*(1<<(n-1))):
            return ""
        ans=[]
        def dfs(cur,step):
            if(step==n):
                ans.append(cur)
                return
            if(step==0):
                dfs("a",step+1)
                dfs("b",step+1)
                dfs("c",step+1)
            else:
                if(cur[-1]!='a'):
                    dfs(cur+"a",step+1)
                if(cur[-1]!='b'):
                    dfs(cur+"b",step+1)
                if(cur[-1]!='c'):
                    dfs(cur+"c",step+1)
        dfs("",0)
        ans.sort()
        return ans[k-1]
print(Solution().getHappyString(3,9))
```
## [字符串乘方](http://cs101.openjudge.cn/practice/02406/)
KMP.next[i]表示前i个数的最大公共前后缀的长度，也是在这一个位置失配时模式串的指针应该跳到的位置。
构建next数组，目标串（模式串）指针在i=0，模式串指针在j=-1.同样可以使用KMP的移动规则，每次两个指针前移一位并记录next[i]，如果失配j就往回跳，一位都不对跳到-1自然从头开始。
找循环节，最小循环节长度=L-next[L]。
![image](https://img2024.cnblogs.com/blog/2669443/202603/2669443-20260316205421816-1532071161.png)
```python
while(True):
    s=input()
    if(s=='.'):
        break
    n=len(s)
    next=[-1]*(n+1)
    i=0
    j=-1
    while(i<n):
        if(j==-1 or s[i]==s[j]):
            i+=1
            j+=1
            next[i]=j
        else:
            j=next[j]
    l=n-next[n]
    if(n%l==0):
        print(n//l)
    else:
        print(1)
```
# 2026.3.17
## [倒排索引查询](http://cs101.openjudge.cn/practice/04093/)
一个集合记录包含所有需要数的杂志，一个集合记录所有包含不需要数的杂志，最后两集合作差集即可。
不能一边读一边进行集合运算，否则前一步不需要的杂志后一步可能又加回来。
a(需要）集合初始化为第一个符合的集合，注意要set()复制一份而不要直接取引用，否则会把原数据修改。
```python
n=int(input())
files=[]
for i in range(n):
    t=list(map(int,input().split()))
    files.append(set(t[1:]))
m=int(input())
for i in range(m):
    q=list(map(int,input().split()))
    a=set(files[q.index(1)])
    b=set()
    for j in range(n):
        if(q[j]==1):
            a&=files[j]
        elif(q[j]==-1):
            b|=files[j]
    c=a-b
    if(len(c)==0):
        print("NOT FOUND")
    else:
        print(" ".join(map(str,sorted(c))))
```
## [编程填空：学生信息处理程序](http://cxsjsx.openjudge.cn/hw202601/A/)
输入逗号分隔的整数：
```cpp
getline(cin,line);
stringstream ss(line);
string token;
getline(ss,name,',');
getline(ss, token, ',');
age = stoi(token);
```
```cpp
#include <iostream>
#include <string>
#include <cstdio>
#include <cstring>
#include <sstream>
#include <cstdlib>
using namespace std;
class Student {
private:
    string name;
    int age;
    int id;
    int scores[5];
    double avg=0;
public:
    void input(){
        string line;
        int idx=0;
        getline(cin,line);
        stringstream ss(line);
        string token;
        getline(ss,name,',');
        getline(ss, token, ',');
        age = stoi(token);
        getline(ss, token, ',');
        id = stoi(token);
        for(int i = 0; i < 4; i++) {
            getline(ss, token, ',');
            scores[i] = stoi(token);
        }
    }
    void calculate(){
        for(int i=0;i<4;i++){
            avg+=scores[i];
        }
        avg/=4;
    }
    void output(){
        cout<<name<<','<<age<<','<<id<<','<<avg<<endl;
    }
};

int main() {
	Student student;        // 定义类的对象
	student.input();        // 输入数据
	student.calculate();    // 计算平均成绩
	student.output();       // 输出数据
}
```
## [Complex类的成员函数](http://cxsjsx.openjudge.cn/hw202601/B/)
输入带分隔符的数还可以使用sscanf.`sscanf(s,"%lf+%lfi",&r,&i);`
重载运算符的基本语法。
```cpp
#include <iostream>
#include <cstring>
#include <cstdlib>
using namespace std;
class Complex {
private:
    double r,i;
public:
    void Print() {
        cout << r << "+" << i << "i" << endl;
    }
    Complex& operator=(const char*s){
        sscanf(s,"%lf+%lfi",&r,&i);
        return *this;
    }
// 在此处补充你的代码
};
int main() {
    Complex a;
    a = "3+4i"; a.Print();
    a = "5+6i"; a.Print();
    return 0;
}
```
# 2026.3.19
## [3维1-median近似](http://cssyb.openjudge.cn/26hw6/1/)
随机选取中心点c，向外划分64个环，每个环取m个点，并将每个点的权重定为card(ring[i])/m.计算选取出的所有点到q的距离即可。
注意long long范围是2^64，约1e18，因此求距离时每个维度坐标之差先换成double.
```cpp
#include<bits/stdc++.h>
using namespace std;
struct Point{
    long long x,y,z;
};
double dist(Point a,Point b){
    double x0=a.x-b.x;
    double y0=a.y-b.y;
    double z0=a.z-b.z;
    double ans=x0*x0+y0*y0+z0*z0;
    return sqrt(ans);
}
struct Sample{
    Point point;
    double weight;
};
Point p[100005];
int main(){
    int n,q;
    scanf("%d %d",&n,&q);
    for(int i=0;i<n;i++){
        scanf("%lld %lld %lld",&p[i].x,&p[i].y,&p[i].z);
    }
    minstd_rand gen;
    int c=int(double(gen())/gen.max()*n);
    double tot=0;
    for(int i=0;i<n;i++){
        tot+=dist(p[i],p[c]);
    }
    double r0=tot*0.2/n;
    vector<Point> rings[64];
    for(int i=0;i<n;i++){
        double d=dist(p[i],p[c]);
        if(d<=r0){
            rings[0].push_back(p[i]);
        }
        else{
            int idx=int(log2(d/r0))+1;
            if(idx>=64) idx=63;
            rings[idx].push_back(p[i]);
        }
    }
    int m=150;
    vector<Sample> res;
    for(int i=0;i<64;i++){
        if(rings[i].size()==0) continue;
        else if(rings[i].size()<=m){
            for(int j=0;j<rings[i].size();j++){
                res.push_back({rings[i][j],1.0});
            }
        }
        else{
            shuffle(rings[i].begin(),rings[i].end(),gen);
            for(int j=0;j<m;j++){
                res.push_back({rings[i][j],double(rings[i].size())/m});
            }
        }
    }
    for(int i=0;i<q;i++){
        Point q0;
        scanf("%lld %lld %lld",&q0.x,&q0.y,&q0.z);
        double ans=0;
        for(int j=0;j<res.size();j++){
            Point p0=res[j].point;
            double w=res[j].weight;
            ans+=dist(p0,q0)*w;
        }
        printf("%lf\n",ans);
    }
}
```
## [Apple](http://cxsjsx.openjudge.cn/hw202602/A/)
1.static类型：整个类共有，可以用类::来访问。
2.动态内存分配：`Apple * p = new Apple[4];`在堆上开辟了四块连续的空间，会调用默认构造函数。需要手动执行`delete[] p;`可以p[0]、p[1]访问。
静态/栈上分配：`Apple p[4];`。
3.拷贝构造函数：使用类成员时定义拷贝规则。
4.析构函数：删除指针时定义操作。
```cpp
#include <iostream>
using namespace std;
class Apple {
// 在此处补充你的代码
public:
    static int nTotalNumber;
    Apple(){
        nTotalNumber++;
    }
    Apple(const Apple &a){

    }
    ~Apple(){
        nTotalNumber--;
    }
    static void PrintTotal() {
            cout << nTotalNumber << endl; 
    }
};
int Apple::nTotalNumber = 0;
Apple Fun(const Apple & a) {
	a.PrintTotal();
	return a;
}
int main()
{
	Apple * p = new Apple[4];
	Fun(p[2]);//4->3
	Apple p1,p2;
	Apple::PrintTotal ();//5
	delete [] p;
	p1.PrintTotal ();//1
	return 0;
}
```
## [返回什么才好呢](http://cxsjsx.openjudge.cn/hw202602/B/)
1.参数默认值`A(int x=123){val=x;}`中，如果不传参则默认val为123，如果传参则val为传入的参数。
2.返回值类型：A&，可以修改原对象。
3.隐式类型转换：a.getObj()=n,隐式转换为A(n).
```cpp
#include <iostream>
using namespace std;
class A {
public:
	int val;

	A(int x=123){
        val=x;
    }
    A& GetObj(){
        return *this;
    }
// 在此处补充你的代码
};
int main()
{
	int m,n;
	A a;
	cout << a.val << endl;
	while(cin >> m >> n) {
		a.GetObj() = m;
		cout << a.val << endl;
		a.GetObj() = A(n);
		cout << a.val<< endl;
	}
	return 0;
}
```
## [奇怪的类复制](http://cxsjsx.openjudge.cn/hw202602/C/)
![image](https://img2024.cnblogs.com/blog/2669443/202603/2669443-20260319213637106-1846106029.png)
```cpp
#include <iostream>
using namespace std;
class Sample {
public:
	int v;
    Sample(int x=0){
        v=x;
    }
    Sample(const Sample &a){
        this->v=a.v+2;
    }
// 在此处补充你的代码
};
void PrintAndDouble(Sample o)
{
	cout << o.v;
	cout << endl;
}
int main()
{
	Sample a(5);
	Sample b = a;
	PrintAndDouble(b);//9
	Sample c = 20;
	PrintAndDouble(c);//22
	Sample d;
	d = a;
	cout << d.v;//5
	return 0;
}
```
## [Big & Base 封闭类问题](http://cxsjsx.openjudge.cn/hw202602/D/)
初始化列表`Big(int n):v(n),b(n)`:令v=n,b=n(b为base类型，会寻找匹配int类型的构造函数，因此相当于b.k=n)
![image](https://img2024.cnblogs.com/blog/2669443/202603/2669443-20260319215638272-616950602.png)
没有默认构造的情况下需要初始化列表。
```cpp
#include <iostream>
#include <string>
using namespace std;
class Base {
public:
	int k;
	Base(int n):k(n) { }
};
class Big
{
public:
	int v;
	Base b;
    Big(int n):v(n),b(n){

    }
    

// 在此处补充你的代码
};
int main()
{
	int n;
	while(cin >>n) {
		Big a1(n);
		Big a2 = a1;
		cout << a1.v << "," << a1.b.k << endl;
		cout << a2.v << "," << a2.b.k << endl;
	}
}
```
# 2026.3.21
## [子字符串的最优划分](https://leetcode.cn/problems/optimal-partition-of-string/description/)
```python3
class Solution:
    def partitionString(self, s: str) -> int:
        ans=1
        a=set()
        n=len(s)
        for i in range(n):
            if(s[i] in a):
                ans+=1
                a=set()
            a.add(s[i])
        return ans
```
# 2026.3.23
## [魔兽世界之一：备战](http://cs101.openjudge.cn/practice/03129/)
1.C++数组赋值，需另外建新数组，然后copy.`copy(begin(red_seq),end(red_seq),red.sequence);`
2.对类内赋值，声明后需要再引用。
3.printf不能传string，可以string.c_str().
```cpp
#include<bits/stdc++.h>
using namespace std;
class Warrior{
public:
    string name;
    int life;
};
class Headquarter{
public:
    string name;
    int warriors[5] = {0};
    static Warrior warrior_list[5];
    int sequence[5];
    int warrior_cnt=0;
    int idx=0;
    int life_sum=0;
    Headquarter(){
        warrior_list[0].name="dragon";
        warrior_list[1].name="ninja";
        warrior_list[2].name="iceman";
        warrior_list[3].name="lion";
        warrior_list[4].name="wolf";
    }
    static void input_cost(){
        for(int i=0;i<5;i++) scanf("%d",&warrior_list[i].life);
    }
    bool make_warrior(int time){
        int temp=0;
        while(life_sum<warrior_list[sequence[idx]].life && temp<5){
            idx++;
            temp++;
            if(idx==5) idx=0;
        }
        if(temp==5){
            printf("%03d %s headquarter stops making warriors\n",time,name.c_str());
            return false;
        }
        warrior_cnt++;
        int num=sequence[idx];
        warriors[num]++;
        life_sum-=warrior_list[num].life;
        printf("%03d %s %s %d born with strength %d,%d %s in %s headquarter\n",time,name.c_str(),warrior_list[num].name.c_str(),warrior_cnt,warrior_list[num].life,warriors[num],warrior_list[num].name.c_str(),name.c_str());
        idx++;
        if(idx==5) idx=0;
        return true;
    }
};
Warrior Headquarter::warrior_list[5];
int main(){
    int t;
    scanf("%d",&t);
    for(int i=1;i<=t;i++){
        int M;
        scanf("%d",&M);
        Headquarter::input_cost();

        Headquarter red,blue;
        red.name="red";
        blue.name="blue";
        red.life_sum=M;
        blue.life_sum=M;

        int red_seq[5]={2,3,4,1,0};
        int blue_seq[5]={3,0,1,2,4};
        copy(begin(red_seq),end(red_seq),red.sequence);
        copy(begin(blue_seq),end(blue_seq),blue.sequence);

        printf("Case:%d\n",i);
        bool flag1=true,flag2=true;
        int time=0;
        while(flag1||flag2){
            if(flag1){
                flag1=red.make_warrior(time);
            }
            if(flag2){
                flag2=blue.make_warrior(time);
            }
            time++;
        }
    }
}
```
# 2026.3.23
## [统计 X 和 Y 频数相等的子矩阵数量](https://leetcode.cn/problems/count-submatrices-with-equal-frequency-of-x-and-y/description/)
```python3
class Solution:
    def numberOfSubmatrices(self, grid: list[list[str]]) -> int:
        m=len(grid)
        n=len(grid[0])
        a=[[0 for _ in range(n+1)]for _ in range(m+1)]
        check=[[0 for _ in range(n+1)]for _ in range(m+1)]
        def trans(x):
            if(x=="X"):
                return 1
            elif(x=="Y"):
                return -1
            return 0
        for i in range(m):
            for j in range(n):
                a[i+1][j+1]=a[i][j+1]+a[i+1][j]+trans(grid[i][j])-a[i][j]
                check[i+1][j+1]=check[i][j+1]|check[i+1][j]|abs(trans(grid[i][j]))
        ans=0
        for i in range(1,m+1):
            for j in range(1,n+1):
                if(check[i][j] and a[i][j]==0):
                    ans+=1
        return ans
```
# 2026.3.24
## [中序表达式转后序表达式](http://cs101.openjudge.cn/practice/24591/)
Shunting Yard调度场算法。建立答案栈和符号栈，根据运算规则存入弹出符号。
![image](https://img2024.cnblogs.com/blog/2669443/202603/2669443-20260324161241917-119586290.png)
```python
n=int(input())
val={"+":1,"-":1,"*":2,"/":2}
for _ in range(n):
    s=input()
    num=""
    ans=[]
    sign=[]
    for i in s:
        if(i.isdigit() or i=='.'):
            num+=i
        else:
            if(num!=""):
                ans.append(num)
                num=""
            if(i=="("):
                sign.append(i)
            elif(i==')'):
                while(sign and sign[-1]!="("):
                    temp=sign[-1]
                    sign.pop()
                    ans.append(temp)
                sign.pop()
            elif(i in "+-*/"):
                while(sign and sign[-1] in "+-*/" and val[sign[-1]]>=val[i]):
                    temp=sign[-1]
                    sign.pop()
                    ans.append(temp)
                sign.append(i)
    if(num!=""):
        ans.append(num)
    while(sign):
        ans.append(sign.pop())
    print(" ".join(ans))
```
## [LRU 缓存](https://leetcode.cn/problems/lru-cache/description/)
思路：

要求查找和插入都O(1)，使用哈希表。要求灵活将内容移到队尾与删除队首，使用双向链表。
也可以使用Python内置的ordered_dict完成，有move_to_end()和popitem(last=False)模块。

代码

```python
class Node:
    def __init__(self,key=0,val=0):
        self.key=key
        self.val=val
        self.prev=None
        self.next=None

class LRUCache:
    def __init__(self, capacity: int):
        self.cache=dict()
        self.capacity=capacity
        self.head=Node()
        self.tail=Node()
        self.head.next=self.tail
        self.tail.prev=self.head

    def get(self, key: int) -> int:
        if(key not in self.cache):
            return -1
        node=self.cache[key]
        self.remove_node(node)
        self.add_to_end(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if(key in self.cache):
            node=self.cache[key]
            node.val=value
            self.remove_node(node)
            self.add_to_end(node)
        else:
            node=Node(key,value)
            self.cache[key]=node
            self.add_to_end(node)
        if(len(self.cache)>self.capacity):
            self.cache.pop(self.head.next.key)
            self.remove_node(self.head.next)

    def remove_node(self,node):
        node.prev.next=node.next
        node.next.prev=node.prev

    def add_to_end(self,node):
        node.prev=self.tail.prev
        node.prev.next=node
        node.next=self.tail
        self.tail.prev=node
```

```python
from collections import OrderedDict
class LRUCache:
    def __init__(self, capacity: int):
        self.od=OrderedDict()
        self.capacity=capacity
    def get(self, key: int) -> int:
        if(key not in self.od):
            return -1
        self.od.move_to_end(key)
        return self.od[key]

    def put(self, key: int, value: int) -> None:
        if(key in self.od):
            self.od.move_to_end(key)
        self.od[key]=value
        if(len(self.od)>self.capacity):
            self.od.popitem(last=False)
```
## [ [USACO12MAR] Flowerpot S](https://www.luogu.com.cn/problem/P2698)
思路：

滑动窗口+单调队列。把所有点按x坐标排序，易知右侧点的left必定比左侧点的left大。因此可以使用滑动窗口，同时使用两个单调队列分别维护段中的最大值与最小值，每次的新值加入队尾并保持递增/递减，最值从队头取，老值从队头删除。

代码

```python
from collections import deque
n,d=map(int,input().split())
rain=[]
for i in range(n):
    t=list(map(int,input().split()))
    rain.append(t)
rain=sorted(rain,key=lambda x:x[0])
maxq=deque()
minq=deque()
left=0
ans=float("INF")
for i in range(n):
    while(maxq and rain[maxq[-1]][1]<=rain[i][1]):
        maxq.pop()
    maxq.append(i)
    while(minq and rain[minq[-1]][1]>=rain[i][1]):
        minq.pop()
    minq.append(i)
    while(rain[maxq[0]][1]-rain[minq[0]][1]>=d and left<i):
        ans=min(ans,rain[i][0]-rain[left][0])
        if(maxq[0]==left):
            maxq.popleft()
        if(minq[0]==left):
            minq.popleft()
        left+=1
if(ans==float("INF")):
    print(-1)
else:
    print(ans)
```
## [河中跳房子](http://cs101.openjudge.cn/pctbook/M08210/)
二分答案。删点可以一路贪心往前，如果距离比当前距离近就右边向右，否则左边右边同时向右。
```python
L,n,m=map(int,input().split())
a=[0]
for i in range(n):
    t=int(input())
    a.append(t)
a.append(L)
l=0
r=L
ans=0
while(l<=r):
    mid=(l+r)>>1
    cnt=0
    cur=0
    for i in range(1,n+2):
        if(a[i]-a[cur]<mid):
            cnt+=1
        else:
            cur=i
    if(cnt>m):
        r=mid-1
    else:
        ans=max(ans,mid)
        l=mid+1
print(ans)
```
# 2026.3.25
## [垂直翻转子矩阵](https://leetcode.cn/problems/flip-square-submatrix-vertically/description/)
```python
class Solution:
    def reverseSubmatrix(self, grid: list[list[int]], x: int, y: int, k: int) -> list[list[int]]:
        m=len(grid)
        n=len(grid[0])
        i=x
        j=x+k-1
        while(i<j):
            grid[i][y:y+k],grid[j][y:y+k]=grid[j][y:y+k],grid[i][y:y+k]
            i+=1
            j-=1
        return grid
print(Solution().reverseSubmatrix([[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]],1,0,3))
```
## [矩阵的最大非负积](https://leetcode.cn/problems/maximum-non-negative-product-in-a-matrix/description/)
最大非负积->最大值与最小值dp
```python
class Solution:
    def maxProductPath(self, grid: list[list[int]]) -> int:
        m=len(grid)
        n=len(grid[0])
        dp_max=[[-1 for _ in range(n)]for _ in range(m)]
        dp_min=[[-1 for _ in range(n)]for _ in range(m)]
        dp_max[0][0]=grid[0][0]
        dp_min[0][0]=grid[0][0]
        for i in range(1,m):
            dp_min[i][0]=dp_min[i-1][0]*grid[i][0]
            dp_max[i][0]=dp_max[i-1][0]*grid[i][0]
        for i in range(1,n):
            dp_min[0][i]=dp_min[0][i-1]*grid[0][i]
            dp_max[0][i]=dp_max[0][i-1]*grid[0][i]
        for i in range(1,m):
            for j in range(1,n):
                dp_min[i][j]=min(dp_min[i-1][j]*grid[i][j],dp_max[i-1][j]*grid[i][j],dp_min[i][j-1]*grid[i][j],dp_max[i][j-1]*grid[i][j])
                dp_max[i][j]=max(dp_min[i-1][j]*grid[i][j],dp_max[i-1][j]*grid[i][j],dp_min[i][j-1]*grid[i][j],dp_max[i][j-1]*grid[i][j])
        t=dp_max[m-1][n-1]
        mod=10**9+7
        if(t<0):
            return -1
        else:
            return t%mod
print(Solution().maxProductPath([[-1,-2,-3],[-2,-3,-3],[-3,-3,-2]]))
```
## [判断矩阵经轮转后是否一致](https://leetcode.cn/problems/determine-whether-matrix-can-be-obtained-by-rotation/description/)
```python
class Solution:
    def rotate(self,mat):
        n=len(mat)
        for i in range(1,n):
            for j in range(i):
                mat[i][j],mat[j][i]=mat[j][i],mat[i][j]
        for i in range(n):
            for j in range(n//2):
                mat[i][j],mat[i][n-j-1]=mat[i][n-j-1],mat[i][j]
        return mat
    def findRotation(self, mat: list[list[int]], target: list[list[int]]) -> bool:
        for i in range(4):
            if(mat==target):
                return True
            self.rotate(mat)
        return False
```
# 2026.3.26
## [今日化学论文](http://cs101.openjudge.cn/pctbook/M20140/)
```python
a=input()
s=[]
n=len(a)
t=""
for i in a:
    if(i=="["):
        if(t!=""):
            s.append(t)
            t=""
        s.append(i)
    elif(i.isdigit()):
        t+=i
    elif(i=="]"):
        tmp=""
        while(s and not s[-1].isdigit()):
            tmp=s[-1]+tmp
            s.pop() 
        tmp=tmp*int(s[-1])
        s.pop()
        s.pop()
        s.append(tmp)
    else:
        if(t!=""):
            s.append(t)
            t=""
        s.append(i)
ans=""
while(s):
    ans=s[-1]+ans
    s.pop()
print(ans)
```
## [k-heavyhitter](http://cssyb.openjudge.cn/26hw7/1/)
使用count-min sketch，分别五次哈希把n个数映到m个位置。每次存储当前n个数的k-heavyhitter,并在n为2的幂的时候清理。
```cpp
#include "streaming.h"
using namespace std;

typedef unsigned long long u64;

#define mix(h) ({					\
			(h) ^= (h) >> 23;		\
			(h) *= 0x2127599bf4325c37ULL;	\
			(h) ^= (h) >> 47; })

u64 fasthash64(u64 v, u64 seed) {
	const uint64_t    m = 0x880355f21e6d1965ULL;
	u64 h = seed;
	h ^= mix(v);
	h *= m;
	return mix(h);
}
int k,n;
set<int> res;
int cols=1000;
void init(int _k) {
    k=_k;
    n=0;
    res.clear();
    for(int i=0;i<5000;i++) Set(i,0);
}
void add(int x) {
    n++;
    int minm=1e9;
    for(int i=0;i<5;i++){
        u64 h=fasthash64(x,i);
        int pos=i*cols+h%cols;
        int temp=Get(pos);
        temp++;
        Set(pos,temp);
        minm=min(minm,temp);
    }
    if((long long)minm*k>=n){
        res.insert(x);
    }
    if((n&(n-1))==0){
        for(auto it=res.begin();it!=res.end();){
            int minm=1e9;
            int x=*it;
            for(int i=0;i<5;i++){
                u64 h=fasthash64(x,i);
                int pos=i*cols+h%cols;
                int temp=Get(pos);
                minm=min(minm,temp);
            }
            if(minm*k<n){
                it=res.erase(it);
            }
            else{
                it++;
            } 
        }
    }
}
vector <int> report() {
    vector<int> ans;
    for(int i:res){
        ans.push_back(i);
    }
    return ans;
}
```
# 2026.3.29
## [简单计算器](https://sunnywhy.com/sfbj/7/1/299)
![image](https://img2024.cnblogs.com/blog/2669443/202603/2669443-20260329171749469-2070197762.png)
顺序同中序转后序表达式，然后使用计算波兰表达式的方法。
```python
a=list(input().split())
s1=[]
s2=[]
dic={"+":1,"-":1,"*":2,"/":2}
def cal(x,y,t):
    x=float(x)
    y=float(y)
    if(t=="+"):
        return x+y
    elif(t=="-"):
        return x-y
    elif(t=="*"):
        return x*y
    elif(t=="/"):
        return x/y
    return 0
for i in a:
    if(i.isdigit()):
        s1.append(i)
    else:
        while(s2 and dic[i]<=dic[s2[-1]]):
            t=s2.pop()
            y=s1.pop()
            x=s1.pop()
            s1.append(cal(x,y,t))
        s2.append(i)
while(s2):
    y=s1.pop()
    x=s1.pop()
    t=s2.pop()
    s1.append(cal(x,y,t))
print(f"{float(s1[-1]):.2f}")
```
## [A Knight's Journey](http://cs101.openjudge.cn/practice/02488/)
```python
t=int(input())
m,n=0,0
ans=""
dx=[-2,-1,1,2,2,1,-1,-2]
dy=[1,2,2,1,-1,-2,-2,-1]
def dfs(x,y,res,step):
    global m,n,ans
    if(step==m*n):
        ans=min(ans,res)
        return
    for i in range(8):
        xx=x+dx[i]
        yy=y+dy[i]
        if(0<=xx<m and 0<=yy<n and vis[xx][yy]==0):
            vis[xx][yy]=1
            dfs(xx,yy,res+a[xx][yy],step+1)
            vis[xx][yy]=0
    return
for qaq in range(t):
    m,n=map(int,input().split())
    a=[["" for _ in range(n)]for _ in range(m)]
    vis=[[0 for _ in range(n)]for _ in range(m)]
    for i in range(m):
        for j in range(n):
            a[i][j]=chr(ord("A")+j)+str(i+1)
    ans="Z26"*26
    vis[0][0]=1
    dfs(0,0,"A1",1)
    print(f"Scenario #{qaq+1}:")
    if(ans=="Z26"*26):
        print("impossible")
    else:
        print(ans)
    print()
```
# 2026.3.30
## [等和矩阵分割 II](https://leetcode.cn/problems/equal-sum-grid-partition-ii/description/)
遍历每一行，并加入总和中。如果总和是数组和的一半，或者减去某个遍历过的数之后符合要求，则正确。删除上半部分的数可以由哈希表维护，把0加入表示不删除。删除下半部分即把数组倒过来。竖着分割即把数组转置。
转置的方法是先*grid解包，再zip.
注意特判只有一列的情况，此时只能删第一个或者分割线上的。第一行在处理完第一行后才能删，最后一行同理。
```python
class Solution:
    def canPartitionGrid(self, grid: list[list[int]]) -> bool:
        m=len(grid)
        n=len(grid[0])
        sum=0
        for i in range(m):
            for j in range(n):
                sum+=grid[i][j]
        def check(a):
            m=len(a)
            n=len(a[0])
            st=set()
            st.add(0)
            s=0
            for i in range(m-1):
                for j in range(n):
                    x=a[i][j]
                    s+=x
                    if(i>0 or j==0 or j==n-1):
                        st.add(x)
                if(n==1):
                    if(s*2==sum or s*2==sum+a[0][0] or s*2==sum+a[i][0]):
                        return True
                    continue
                if(s*2-sum in st):
                    return True
                if(i==0):
                    st.update(a[i])
            return False
        return (check(grid) or check(grid[::-1]) or check(list(zip(*grid))) or check(list(zip(*grid))[::-1]))
print(Solution().canPartitionGrid([[1,4],[2,3]]))
```
## [解数独](https://leetcode.cn/problems/sudoku-solver/description/)
二进制存储每行、列与九宫格的状态。
mask & (-mask)：取出最低位的1，从最低位开始尝试。
digit = bin(digitMask).count("0") - 1：获得最低位的1是第几位。
mask &= (mask - 1)：去掉最低位的1
启发式搜索：先把能唯一确定的格子填好，再对不确定的格子dfs.
注意dfs的时候如果成功了要传递状态并return掉，避免把好的结果覆盖掉。
```python
class Solution:
    def solveSudoku(self, board: list[list[str]]) -> None:
        row=[0]*9
        col=[0]*9
        block=[[0 for _ in range(3)]for _ in range(3)]
        spaces=[]
        def flip(i,j,digit):
            row[i]^=(1<<digit)
            col[j]^=(1<<digit)
            block[i//3][j//3]^=(1<<digit)
        def dfs(step):
            global valid
            if(step==len(spaces)):
                return True
            i,j=spaces[step]
            mask=(~(row[i]|col[j]|block[i//3][j//3]))&0x1ff
            while(mask):
                qaq=mask&(-mask)
                digit=bin(qaq).count('0')-1
                flip(i,j,digit)
                board[i][j]=str(digit+1)
                if(dfs(step+1)):
                    return True
                flip(i,j,digit)
                board[i][j]='.'
                mask&=(mask-1)
            return False

        for i in range(9):
            for j in range(9):
                if(board[i][j]!='.'):
                    flip(i,j,int(board[i][j])-1)
        while(True):
            flag=False
            for i in range(9):
                for j in range(9):
                    if(board[i][j]=='.'):
                        mask=(~(row[i]|col[j]|block[i//3][j//3]))&0x1ff
                        if(not (mask&(mask-1))):
                            digit=bin(mask).count('0')-1
                            flip(i,j,digit)
                            board[i][j]=str(digit+1)
                            flag=True
            if(not flag):
                break
        for i in range(9):
            for j in range(9):
                if(board[i][j]=='.'):
                    spaces.append((i,j))
        dfs(0)
        """
        Do not return anything, modify board in-place instead.
        """
board=[["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]
Solution().solveSudoku(board)
for i in range(9):
    for j in range(9):
        print(board[i][j],end=" ")
    print()
```
## [判断通过操作能否让字符串相等 II](https://leetcode.cn/problems/check-if-strings-can-be-made-equal-with-operations-ii/description/)
```python
class Solution:
    def checkStrings(self, s1: str, s2: str) -> bool:
        s11,s12,s21,s22=[],[],[],[]
        n=len(s1)
        for i in range(n):
            if(i%2==0):
                s11.append(s1[i])
                s21.append(s2[i])
            else:
                s12.append(s1[i])
                s22.append(s2[i])
        s11.sort()
        s12.sort()
        s21.sort()
        s22.sort()
        if(s11==s21 and s12==s22):
            return True
        return False
```
# 2026.3.31
## [城堡问题](http://cs101.openjudge.cn/pctbook/M02815/)
求连通块长度，而非递归深度。因此每次搜到一块就加一。
```python
m=int(input())
n=int(input())
a=[]
dx=[0,-1,0,1]
dy=[-1,0,1,0]
def dfs(x,y,step):
    area=1
    for i in range(4):
        if((a[x][y]&(1<<i))==0):
            xx=x+dx[i]
            yy=y+dy[i]
            if(0<=xx<m and 0<=yy<n and vis[xx][yy]==0):
                vis[xx][yy]=1
                area+=dfs(xx,yy,step+1)
    return area
for i in range(m):
    a.append(list(map(int,input().split())))
ans=0
max_res=0
vis=[[0 for _ in range(n)]for _ in range(m)]
for i in range(m):
    for j in range(n):
        if(vis[i][j]==0):
            vis[i][j]=1
            max_res=max(max_res,dfs(i,j,1))
            ans+=1
print(ans)
print(max_res)
```
## [字典序最小的生成字符串](https://leetcode.cn/problems/lexicographically-smallest-generated-string/description/)
```python
class Solution:
    def generateString(self, str1: str, str2: str) -> str:
        n=len(str1)
        m=len(str2)
        a=['?']*(n+m-1)
        for i in range(n):
            if(str1[i]=='T'):
                for j in range(i,i+m):
                    if(a[j]!='?' and a[j]!=str2[j-i]):
                        return ""
                    a[j]=str2[j-i]
        qaq=a.copy()
        for i in range(n+m-1):
            if(qaq[i]=='?'):
                qaq[i]='a'
        for i in range(n):
            if(str1[i]=='F'):
                if("".join(qaq[i:i+m])==str2):
                    for j in range(i+m-1,i-1,-1):
                        if('?' not in a[i:i+m]):
                            return ""
                        if(a[j]=="?"):
                            qaq[j]='b'
                            break
        return "".join(qaq)
print(Solution().generateString("TTFFT","fff"))
```
## [MyString](http://cxsjsx.openjudge.cn/hw202604/A/)
![image](https://img2024.cnblogs.com/blog/2669443/202603/2669443-20260331164926900-377297742.png)
![image](https://img2024.cnblogs.com/blog/2669443/202603/2669443-20260331165512764-222055441.png)
```cpp
#include <iostream>
#include <string>
#include <cstring>
using namespace std;
class MyString {
	char * p;
public:
	MyString(const char * s) {
		if( s) {
			p = new char[strlen(s) + 1];
			strcpy(p,s);
		}
		else
			p = NULL;

	}
	~MyString() { if(p) delete [] p; }
// 在此处补充你的代码
    //拷贝构造，MyString s2=s1
    MyString(const MyString &s){
        if(s.p){
            p = new char[strlen(s.p) + 1];
            strcpy(p,s.p);
        }
        else p=NULL;
    }
    //运算符重载 s2=s1(MyString)
    MyString &operator=(const MyString &s){
        if(this!=&s){
            if(p) delete []p;
            if(s.p){
                p=new char[strlen(s.p)+1];
                strcpy(p,s.p);
            }
            else p=NULL;
        }
        return *this;
    }
    //运算符重载 s2=w2(char*)
    MyString &operator=(const char*s){
        if(p) delete []p;
        if(s){
            p=new char[strlen(s)+1];
            strcpy(p,s);
        }
        else p=NULL;
        return *this;
    }
    //s3.Copy(w1)
    void Copy(const char*s){
        *this=s;
    }
    //cout<<
    friend ostream &operator<<(ostream &os,const MyString &s){
        if(s.p) os<<s.p;
        return os;
    }
};
int main()
{
	char w1[200],w2[100];
	while( cin >> w1 >> w2) {
		MyString s1(w1),s2 = s1;
		MyString s3(NULL);
		s3.Copy(w1);
		cout << s1 << "," << s2 << "," << s3 << endl;

		s2 = w2;
		s3 = s2;
		s1 = s3;
		cout << s1 << "," << s2 << "," << s3 << endl;
		
	}
}
```
## [看上去好坑的运算符重载](http://cxsjsx.openjudge.cn/hw202604/B/)
类型重载。operator int()
![image](https://img2024.cnblogs.com/blog/2669443/202603/2669443-20260331170655204-1454563866.png)
```cpp
#include <iostream> 
using namespace std;
class MyInt 
{ 
	int nVal; 
	public: 
	MyInt( int n) { nVal = n ;}
// 在此处补充你的代码
    MyInt & operator-(int n){
        nVal-=n;
        return *this;
    }
    operator int(){
        return nVal;
    }
}; 
int Inc(int n) {
	return n + 1;
}
int main () { 
	int n;
	while(cin >>n) {
		MyInt objInt(n); 
		objInt-2-1-3; 
		cout << Inc(objInt);
		cout <<","; 
		objInt-2-1; 
		cout << Inc(objInt) << endl;
	}
	return 0;
}
```
## [惊呆！Point竟然能这样输入输出](http://cxsjsx.openjudge.cn/hw202604/C/)
流运算符重载。输入Point可修改，输出为const.
```cpp
#include <iostream> 
using namespace std;
class Point { 
	private: 
		int x; 
		int y; 
	public: 
		Point() { };
// 在此处补充你的代码
    friend istream &operator>>(istream &is,Point &p){
        is>>p.x>>p.y;
        return is;
    }
    friend ostream &operator<<(ostream &os,const Point &p){
        os<<p.x<<","<<p.y;
        return os;
    }
}; 
int main() 
{ 
 	Point p;
 	while(cin >> p) {
 		cout << p << endl;
	 }
	return 0;
}
```
## [二维数组类](http://cxsjsx.openjudge.cn/hw202604/D/)
memcpy:
![image](https://img2024.cnblogs.com/blog/2669443/202603/2669443-20260331174718016-644927490.png)
[]:重载，返回一整行，然后用[j]来定位。
():定位到某一个数
```cpp
#include <iostream>
#include <cstring>
using namespace std;

class Array2 {
private:
    int r,c;
    int *p;
public:
    Array2(int _r=0,int _c=0):r(_r),c(_c) {
        if(r*c>0) p=new int[r*c];
        else p=NULL;
    }
    ~Array2(){
        if(p) delete []p;
    }
    Array2(const Array2 &a){
        r=a.r;
        c=a.c;
        if(r*c>0){
            p=new int[r*c];
            memcpy(p,a.p,sizeof(int)*r*c);
        }
        else p=NULL;
    }
    Array2 &operator=(const Array2 &a){
        if(this!=&a){
            if(p) delete []p;
            r=a.r;
            c=a.c;
            if(r*c>0){
                p=new int[r*c];
                memcpy(p,a.p,sizeof(int)*r*c);
            }
            else p=NULL;
        }
        return *this;
    }
    int* operator[](int i){
        return p+i*c;
    }
    int& operator()(int i,int j){
        return p[i*c+j];
    }
// 在此处补充你的代码

};

int main() {
    Array2 a(3,4);
    int i,j;
    for(  i = 0;i < 3; ++i )
        for(  j = 0; j < 4; j ++ )
            a[i][j] = i * 4 + j;
    for(  i = 0;i < 3; ++i ) {
        for(  j = 0; j < 4; j ++ ) {
            cout << a(i,j) << ",";
        }
        cout << endl;
    }
    cout << "next" << endl;
    Array2 b;     b = a;
    for(  i = 0;i < 3; ++i ) {
        for(  j = 0; j < 4; j ++ ) {
            cout << b[i][j] << ",";
        }
        cout << endl;
    }
    return 0;
}
```
## [别叫，这个大整数已经很简化了!](http://cxsjsx.openjudge.cn/hw202604/E/)
![image](https://img2024.cnblogs.com/blog/2669443/202604/2669443-20260401000225227-213222312.png)
选择friend:1.非类内函数访问private内容
2.对称性转换
3.左操作数不是类对象
```cpp
#include <iostream> 
#include <cstring> 
#include <cstdlib> 
#include <cstdio> 
using namespace std;
const int MAX = 110; 
class CHugeInt {
// 在此处补充你的代码
private:
    int digits[210];
    int len;
public:
    CHugeInt(const char *s){
        memset(digits,0,sizeof(digits));
        len=strlen(s);
        for(int i=0;i<len;i++){
            digits[i]=s[len-i-1]-'0';
        }
    }
    CHugeInt(int n){
        memset(digits,0,sizeof(digits));
        if(n==0) len=1;
        else{
            len=0;
            while(n>0){
                digits[len++]=n%10;
                n/=10;
            }
        }
    }
    friend CHugeInt operator+(const CHugeInt &a,const CHugeInt &b){
        CHugeInt res(0);
        res.len=0;
        int carry=0;
        int max_len=max(a.len,b.len);
        for(int i=0;i<max_len||carry;i++){
            int sum=a.digits[i]+b.digits[i]+carry;
            res.digits[i]=sum%10;
            carry=sum/10;
            res.len++;
        }
        // if(carry){
        //     res.digits[max_len++]=carry;
        // }
        return res;
    }
    CHugeInt& operator+=(const CHugeInt &n){
        *this=*this+n;
        return *this;
    }
    CHugeInt& operator++(){
        *this+=1;
        return *this;
    }
    CHugeInt operator++(int){
        CHugeInt temp=*this;
        *this+=1;
        return temp;
    }
    friend ostream& operator<<(ostream &os,const CHugeInt &a){
        for(int i=a.len-1;i>=0;i--){
            os<<a.digits[i];
        }
        return os;
    }
};
int  main() 
{ 
	char s[210];
	int n;

	while (cin >> s >> n) {
		CHugeInt a(s);
		CHugeInt b(n);

		cout << a + b << endl;
		cout << n + a << endl;
		cout << a + n << endl;
		b += n;
		cout  << ++ b << endl;
		cout << b++ << endl;
		cout << b << endl;
	}
	return 0;
}
```
## [全面的MyString](http://cxsjsx.openjudge.cn/hw202605/A/)
```cpp
#include <cstdlib>
#include <iostream>
using namespace std;
int strlen(const char * s) 
{	int i = 0;
	for(; s[i]; ++i);
	return i;
}
void strcpy(char * d,const char * s)
{
	int i = 0;
	for( i = 0; s[i]; ++i)
		d[i] = s[i];
	d[i] = 0;
		
}
int strcmp(const char * s1,const char * s2)
{
	for(int i = 0; s1[i] && s2[i] ; ++i) {
		if( s1[i] < s2[i] )
			return -1;
		else if( s1[i] > s2[i])
			return 1;
	}
	return 0;
}
void strcat(char * d,const char * s)
{
	int len = strlen(d);
	strcpy(d+len,s);
}
class MyString
{
private:
    char *p;
public:
    MyString(const char *s=""){
        if(s){
            p=new char[strlen(s)+1];
            strcpy(p,s);
        }
        else p=NULL;
    }
    ~MyString(){
        if(p) delete []p;
    }
    MyString(const MyString &s){
        if(s.p){
            p=new char[strlen(s.p)+1];
            strcpy(p,s.p);
        }
        else p=NULL;
    }
    MyString& operator=(const MyString &s){
        if(this!=&s){
            if(p) delete []p;
            if(s.p){
                p=new char[strlen(s.p)+1];
                strcpy(p,s.p);
            }
            else p=NULL;
        }
        return *this;
    }
    MyString& operator=(const char*s){
        if(p) delete []p;
        if(s){
            p=new char[strlen(s)+1];
            strcpy(p,s);
        }
        else p=NULL;
        return *this;
    }
    friend MyString operator+(const MyString &s,const MyString &t){
        MyString res("");
        res.p=new char[strlen(s.p)+strlen(t.p)+1];
        strcpy(res.p,s.p);
        strcat(res.p,t.p);
        return res;
    }
    MyString& operator+=(const MyString &s){
        *this=*this+s;
        return *this;
    }
    friend bool operator>(const MyString &s,const MyString &t){
        return strcmp(s.p,t.p)>0;
    }
    friend bool operator<(const MyString &s,const MyString &t){
        return strcmp(s.p,t.p)<0;
    }
    friend bool operator==(const MyString &s,const MyString &t){
        return strcmp(s.p,t.p)==0;
    }
    char & operator[](int i){
        return p[i];
    }
    MyString operator()(int pos,int len){
        MyString res("");
        res.p=new char[len+1];
        for(int i=0;i<len;i++){
            res.p[i]=p[pos+i];
        }
        res.p[len]=0;
        return res;
    }
    friend ostream &operator<<(ostream &os,const MyString &s){
        if(s.p) os<<s.p;
        return os;
    }
// 在此处补充你的代码
};


int CompareString( const void * e1, const void * e2)
{
	MyString * s1 = (MyString * ) e1;
	MyString * s2 = (MyString * ) e2;
	if( * s1 < *s2 )
	return -1;
	else if( *s1 == *s2)
	return 0;
	else if( *s1 > *s2 )
	return 1;
}
int main()
{
	MyString s1("abcd-"),s2,s3("efgh-"),s4(s1);
	MyString SArray[4] = {"big","me","about","take"};
	cout << "1. " << s1 << s2 << s3<< s4<< endl;
	s4 = s3;
	s3 = s1 + s3;
	cout << "2. " << s1 << endl;
	cout << "3. " << s2 << endl;
	cout << "4. " << s3 << endl;
	cout << "5. " << s4 << endl;
	cout << "6. " << s1[2] << endl;
	s2 = s1;
	s1 = "ijkl-";
	s1[2] = 'A' ;
	cout << "7. " << s2 << endl;
	cout << "8. " << s1 << endl;
	s1 += "mnop";
	cout << "9. " << s1 << endl;
	s4 = "qrst-" + s2;
	cout << "10. " << s4 << endl;
	s1 = s2 + s4 + " uvw " + "xyz";
	cout << "11. " << s1 << endl;
	qsort(SArray,4,sizeof(MyString),CompareString);
	for( int i = 0;i < 4;i ++ )
	cout << SArray[i] << endl;
	//s1的从下标0开始长度为4的子串
	cout << s1(0,4) << endl;
	//s1的从下标5开始长度为10的子串
	cout << s1(5,10) << endl;
	return 0;
}
```
## [继承自string的MyString](http://cxsjsx.openjudge.cn/hw202605/B/)
```cpp
#include <cstdlib>
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;
class MyString:public string
{
// 在此处补充你的代码
public:
    MyString():string(){}
    MyString(const char *s):string(s){}
    MyString(const string &s):string(s){}
    MyString operator()(int pos,int len){
        return this->substr(pos,len);
    }
};


int main()
{
	MyString s1("abcd-"),s2,s3("efgh-"),s4(s1);
	MyString SArray[4] = {"big","me","about","take"};
	cout << "1. " << s1 << s2 << s3<< s4<< endl;
	s4 = s3;
	s3 = s1 + s3;
	cout << "2. " << s1 << endl;
	cout << "3. " << s2 << endl;
	cout << "4. " << s3 << endl;
	cout << "5. " << s4 << endl;
	cout << "6. " << s1[2] << endl;
	s2 = s1;
	s1 = "ijkl-";
	s1[2] = 'A' ;
	cout << "7. " << s2 << endl;
	cout << "8. " << s1 << endl;
	s1 += "mnop";
	cout << "9. " << s1 << endl;
	s4 = "qrst-" + s2;
	cout << "10. " << s4 << endl;
	s1 = s2 + s4 + " uvw " + "xyz";
	cout << "11. " << s1 << endl;
        sort(SArray,SArray+4);
	for( int i = 0;i < 4;i ++ )
	cout << SArray[i] << endl;
	//s1的从下标0开始长度为4的子串
	cout << s1(0,4) << endl;
	//s1的从下标5开始长度为10的子串
	cout << s1(5,10) << endl;
	return 0;
}
```