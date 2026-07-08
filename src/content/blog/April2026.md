---
title: 26spring做题记录 - April
description: 2026.4做题记录及4月数算月考
publishedAt: 2026-04-01
tags:
  - 算法
  - Python
  - Cpp
  - OOP
  - 随机化
  - 数据结构
---
# 2026.4.1 月考

：你说不会今天没有月考吧

-六道正常题目

：今天没有骗你何尝不是一种骗到你了
## [反反复复](http://cs101.openjudge.cn/20260401mockexam/E02039/)
代码复用这一块。
```python
n=int(input())
a=list(input())
a.insert(0," ")
for i in range(1,n+1):
    for j in range(1,len(a)):
        if(j%(2*n)==i or j%(2*n)==(2*n+1-i if i!=1 else 0)):
            print(a[j],end="")
```
## [Grandpa is Famous](http://cs101.openjudge.cn/20260401mockexam/E02092/)
这里不需要排序，直接扫两遍记下最大值和第二大值即可。
```python
from collections import defaultdict
while(True):
    n,m=map(int,input().split())
    if(n==0 and m==0):
        break
    a=[]
    for i in range(n):
        a.append(list(map(int,input().split())))
    rank=defaultdict(int)
    for i in range(n):
        for j in range(m):
            rank[a[i][j]]+=1
    maxm=max(rank.values())
    res=0
    for i in rank.values():
        if(i>res and i<maxm):
            res=i
    ans=[]
    for i in rank.keys():
        if(rank[i]==res):
            ans.append(i)
    print(" ".join(map(str,sorted(ans))))
```
## [木材加工](http://cs101.openjudge.cn/20260401mockexam/M02774/)
```python
n,k=map(int,input().split())
a=[]
for i in range(n):
    a.append(int(input()))
if(sum(a)<k):
    print(0)
else:
    ans=0
    l=1
    r=max(a)
    while(l<=r):
        mid=(l+r)>>1
        cnt=0
        for i in a:
            cnt+=i//mid
        if(cnt>=k):
            ans=max(ans,mid)
            l=mid+1
        else:
            r=mid-1
    print(ans)
```
## [出栈序列统计](http://cs101.openjudge.cn/20260401mockexam/M04077/)
```python
from math import comb
n=int(input())
print(comb(2*n,n)//(n+1))
```
## [合法出栈序列pub](http://cs101.openjudge.cn/20260401mockexam/M30637/)
模拟。
```python
x=input()
n=len(x)
while(True):
    try:
        s=input()
        t=[]
        i=0#s
        j=0#x
        if(len(s)!=n):
            print("NO")
            continue
        while(j<n):
            if(len(t)>0 and s[i]==t[-1]):
                t.pop()
                i+=1
            else:
                t.append(x[j])
                j+=1
        while(i<n):
            if(len(t)>0 and s[i]==t[-1]):
                t.pop()
                i+=1
            else:
                break
        if(len(t)==0):
            print("YES")
        else:
            print("NO")
    except EOFError:
        break
```
## [完美交易窗口](http://cs101.openjudge.cn/20260401mockexam/T30102/)
一个单调减栈maxs记录j左侧第一个比它大的元素（即所有可能买入点的左边界），另一个单调增栈mins记录j左侧所有可能的买入点（即从它开始到j始终保持它是序列最小值）。因此更新mins的过程中可以直接二分找到对于每个右边界，最长的左边界。
月考时候没多想直接得出左侧第一个比它大的与右侧第一个比它小的然后暴力枚举了，怎么不算一种$n^2$过百万（）（虽然期望复杂度是$O(nlogn)$)。
赛时代码
```python
from collections import deque
n=int(input())
a=[]
for i in range(n):
    a.append(int(input()))
maxs=[]
mins=[]
res=0
low=[0]*n
high=[0]*n
for i in range(n):
    while(maxs and a[maxs[-1]]>=a[i]):#increase
        t=maxs.pop()
        low[t]=i-1
    maxs.append(i)
while(maxs):
    t=maxs.pop()
    low[t]=n-1
a_new=a[::-1]
for i in range(n):
    while(mins and a_new[mins[-1]]<=a_new[i]):
        t=mins.pop()
        high[n-1-t]=n-i
    mins.append(i)
while(mins):
    t=mins.pop()
    high[n-1-t]=0
# print(a)
# print(low)
# print(high)
for i in range(n):
    for j in range(i+1,low[i]+1):
        if(high[j]<=i):
            res=max(res,j-i+1)
print(res)
```
优化版
```python
import bisect
n=int(input())
a=[]
for i in range(n):
    a.append(int(input()))
maxs=[]
mins=[]
res=0
high=[0]*n
for i in range(n):
    while(maxs and a[maxs[-1]]<a[i]):#decrease
        maxs.pop()
    high[i]=maxs[-1] if maxs else -1
    maxs.append(i)
for i in range(n):
    while(mins and a[mins[-1]]>=a[i]):#increase
        mins.pop()
    t=bisect.bisect_right(mins,high[i])
    if(t<len(mins)):
        res=max(res,i-mins[t]+1)
    mins.append(i)
print(res)
```
赛后数据已加强，需要使用`sys.stdin.read()`以优化IO。
AI优化版：
```plaintext
import sys
import bisect

def solve():
    # 1. 快速读取：一次性读取所有输入
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    
    n = int(input_data[0])
    # 直接转换列表，避免循环 append
    a = list(map(int, input_data[1:]))

    # 预分配空间
    high = [-1] * n
    maxs = []
    
    # 2. 第一个循环：寻找左侧禁区
    for i in range(n):
        # 这里的逻辑是寻找左边第一个 >= a[i] 的数
        # 用 < a[i] 弹出，剩下的就是 >= a[i] 的
        while maxs and a[maxs[-1]] < a[i]:
            maxs.pop()
        if maxs:
            high[i] = maxs[-1]
        maxs.append(i)

    res = 0
    mins = []
    
    # 3. 第二个循环：匹配买入点
    for i in range(n):
        # 维护严格递增栈（保证 a[i] 是区间内唯一最小值）
        while mins and a[mins[-1]] >= a[i]:
            mins.pop()
        
        # 二分查找：找到第一个索引 > high[i] 的买入点
        t = bisect.bisect_right(mins, high[i])
        
        if t < len(mins):
            buy_idx = mins[t]
            # 盈利检查：虽然 mins 逻辑基本保证了这一点，但为了严谨加上判断
            if a[i] > a[buy_idx]:
                curr_len = i - buy_idx + 1
                if curr_len > res:
                    res = curr_len
        
        mins.append(i)

    # 4. 快速输出
    sys.stdout.write(str(res) + '\n')

if __name__ == "__main__":
    solve()
```
# 2026.4.2
## [魔兽世界之二：装备](http://cxsjsx.openjudge.cn/hw202605/C/)
```cpp
#include<bits/stdc++.h>
using namespace std;
string weapon[3]={"sword","bomb","arrow"};
string warrior_list[5]={"dragon","ninja","iceman","lion","wolf"};
int warrior_cost[5];
class Warrior{
protected:
    int id;
    int strength;
    string type;
    string side;
public:
    Warrior(int _id,int _strength,string _type,string _side):id(_id),strength(_strength),type(_type),side(_side){}
    virtual ~Warrior(){}
    virtual void print_special()=0;
    string getType(){
        return type;
    }
    int getStrength(){
        return strength;
    }
};
class Dragon:public Warrior{
private:
    double morale;
    int weaponid;
public:
    Dragon(int _id,int _strength,string _side,int remain_health,int cost)
        :Warrior(_id,_strength,"dragon",_side){
        morale=(double)remain_health/cost;
        weaponid=id%3;
        }
    void print_special() override{
        printf("It has a %s,and it's morale is %0.2f\n",weapon[weaponid].c_str(),morale);
    }
};
class Ninja:public Warrior{
private:
    int weaponid1;
    int weaponid2;
public:
    Ninja(int _id,int _strength,string _side)
        :Warrior(_id,_strength,"ninja",_side){
            weaponid1=id%3;
            weaponid2=(id+1)%3;
        }
    void print_special() override{
        printf("It has a %s and a %s\n",weapon[weaponid1].c_str(),weapon[weaponid2].c_str());
    }
};
class Iceman:public Warrior{
private:
    int weaponid;
public:
    Iceman(int _id,int _strength,string _side)
        :Warrior(_id,_strength,"iceman",_side){
            weaponid=id%3;
        }
    void print_special() override{
        printf("It has a %s\n",weapon[weaponid].c_str());
    }
};
class Lion:public Warrior{
private:
    int loyalty;
public:
    Lion(int _id,int _strength,string _side,int remain_health)
        :Warrior(_id,_strength,"lion",_side){
            loyalty=remain_health;
        }
    void print_special() override{
        printf("It's loyalty is %d\n",loyalty);
    }
};
class Wolf:public Warrior{
public:
    Wolf(int _id,int _strength,string _side)
        :Warrior(_id,_strength,"wolf",_side){}
    void print_special() override{}
};
class Headquarter{
private:
    string side;
    int life_sum;
    int sequence[5];
    int warrior_tot;
    int warrior_nums[5];
public:
    Headquarter(string _side,int _life_sum,int seq[5]):side(_side),life_sum(_life_sum),warrior_tot(0){
        for(int i=0;i<5;i++) sequence[i]=seq[i];
        memset(warrior_nums,0,sizeof(warrior_nums));
    }
    int idx=0;
    bool make_warrior(int time){
        int temp=0;
        while(life_sum<warrior_cost[sequence[idx]] && temp<5){
            idx++;
            temp++;
            if(idx==5) idx=0;
        }
        if(temp==5){
            printf("%03d %s headquarter stops making warriors\n",time,side.c_str());
            return false;
        }
        warrior_tot++;
        int num=sequence[idx];
        warrior_nums[num]++;
        life_sum-=warrior_cost[num];
        printf("%03d %s %s %d born with strength %d,%d %s in %s headquarter\n",time,side.c_str(),warrior_list[num].c_str(),warrior_tot,warrior_cost[num],warrior_nums[num],warrior_list[num].c_str(),side.c_str());
        Warrior* p=nullptr;
        if(num == 0) p = new Dragon(warrior_tot, warrior_cost[num], side, life_sum, warrior_cost[num]);
        else if(num == 1) p = new Ninja(warrior_tot, warrior_cost[num], side);
        else if(num == 2) p = new Iceman(warrior_tot, warrior_cost[num], side);
        else if(num == 3) p = new Lion(warrior_tot, warrior_cost[num], side, life_sum);
        else if(num == 4) p = new Wolf(warrior_tot, warrior_cost[num], side);
        if(p) {
            p->print_special();
            delete p;
        }
        idx++;
        if(idx==5) idx=0;
        return true;
    }
}; 
int main(){
    int t;
    scanf("%d",&t);
    for(int i=1;i<=t;i++){
        int M;
        scanf("%d",&M);
        for(int j=0;j<5;j++) scanf("%d",&warrior_cost[j]);
        int red_seq[5]={2,3,4,1,0};
        int blue_seq[5]={3,0,1,2,4};
        Headquarter red("red",M,red_seq),blue("blue",M,blue_seq);
        printf("Case:%d\n",i);
        int time=0;
        bool red_stop=false,blue_stop=false;
        while(!red_stop || !blue_stop){
            if(!red_stop) red_stop=!red.make_warrior(time);
            if(!blue_stop) blue_stop=!blue.make_warrior(time);
            time++;
        }
    }
    return 0;
}
```
# 2026.4.7
## [二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/description/)
```python
from typing import List, Optional
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        res=[]
        def dfs(node):
            if(node is None):
                return
            dfs(node.left)
            res.append(node.val)
            dfs(node.right)
        dfs(root)
        return res
print(Solution().inorderTraversal(TreeNode(1,None,TreeNode(2,TreeNode(3)))))
```
```python
from typing import List, Optional
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        res=[]
        s=[]
        node=root
        while(node is not None or len(s)>0):
            while(node is not None):
                s.append(node)
                node=node.left
            node=s.pop()
            res.append(node.val)
            node=node.right
        return res

print(Solution().inorderTraversal(TreeNode(1,None,TreeNode(2,TreeNode(3)))))
```
## [将有序数组转换为二叉搜索树](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/description/)
每次令中间节点为根节点，最终一定符合要求。递归分治解决。
```python
from typing import Optional,List
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class Solution:
    def sortedArrayToBST(self, nums: List[int]) -> Optional[TreeNode]:
        def op(l,r):
            if(l>r):
                return None
            mid=(l+r)>>1
            root=TreeNode(nums[mid])
            root.left=op(l,mid-1)
            root.right=op(mid+1,r)
            return root
        return op(0,len(nums)-1)
print(Solution().sortedArrayToBST([-10,-3,0,5,9]))
```
## [二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/description/)
bfs，每一次把当前层所有点都处理完。
```python
from typing import Optional,List
from collections import deque
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        q=deque()
        res=[]
        if(root):
            q.append(root)
        while(q):
            n=len(q)
            ans=[]
            for i in range(n):
                node=q.popleft()
                if(node is None):
                    continue
                ans.append(node.val)
                if(node.left):
                    q.append(node.left)
                if(node.right):
                    q.append(node.right)
            res.append(ans)
        return res

print(Solution().levelOrder(TreeNode(3,TreeNode(9),TreeNode(20,TreeNode(15),TreeNode(7)))))
```
## [二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/description/)
![image](https://img2024.cnblogs.com/blog/2669443/202604/2669443-20260407231143131-1662251735.png)
```python
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        if(not root or root==p or root==q):
            return root
        left=self.lowestCommonAncestor(root.left,p,q)
        right=self.lowestCommonAncestor(root.right,p,q)
        if(left and right):
            return root
        if(left):
            return left
        if(right):
            return right
        return None
```
## [最深叶节点的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-deepest-leaves/description/)
递归。如果左子树深度大于右子树，那么lca是左子树的lca。如果深度相等，最深节点分布在两边，lca标记为当前节点。
```python
from typing import Optional,List
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class Solution:
    def lcaDeepestLeaves(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        def dfs(node):
            if(node is None):
                return (None,0)
            lca_left,depth_left=dfs(node.left)
            lca_right,depth_right=dfs(node.right)
            if(depth_left==depth_right):
                return (node,depth_left+1)
            elif(depth_left>depth_right):
                return (lca_left,depth_left+1)
            elif(depth_left<depth_right):
                return (lca_right,depth_right+1)
        return dfs(root)[0]
print(Solution().lcaDeepestLeaves(TreeNode(1,TreeNode(2),TreeNode(3,TreeNode(4),TreeNode(5)))))
```
# 2026.4.8
## [森林的带度数层次序列存储](http://cs101.openjudge.cn/practice/07161/)
```python
from collections import deque
class TreeNode:
    def __init__(self,x,):
        self.val=x
        self.children=[]
def postorder(root):
    if(root is None):
        return []
    for child in root.children:
        postorder(child)
    res.append(root.val)
    return res
n=int(input())
ans=[]
for qaq in range(n):
    s=list(input().split())
    t=len(s)
    t//=2
    nodes=[]
    deg=[]
    for qwq in range(t):
        nodes.append(s[qwq*2])
        deg.append(int(s[qwq*2+1]))
    q=deque()
    root=TreeNode(nodes[0])
    degree0=deg[0]
    q.append((root,degree0))
    cur=0
    while(q):
        n=len(q)
        for i in range(n):
            node,degree=q.popleft()
            for j in range(cur+1,cur+degree+1):
                child=TreeNode(nodes[j])
                node.children.append(child)
                q.append((child,deg[j]))
            cur+=degree
    res=[]
    ans.extend(postorder(root))
print(" ".join(ans))
```
## [遍历树](http://cs101.openjudge.cn/practice/27928/)
使用邻接表存树(否则会MLE)。对树dfs，每次将当前节点与子节点排序，并依次dfs。如果轮到了当前节点就输出。
寻找根节点的方法：1.找入度为零的点
2.包含所有点的集合与包含所有子节点集合的差集
```python
def dfs(node):
    temp=[node]
    for i in adj[node]:
        temp.append(i)
    temp.sort()
    for i in temp:
        if(i==node):
            print(i)
        else:
            dfs(i)
n=int(input())
adj={}
all_nodes=set()
children_nodes=set()
for i in range(n):
    temp=list(map(int,input().split()))
    val=temp[0]
    adj[val]=temp[1:]
    all_nodes.add(val)
    for j in temp[1:]:
        children_nodes.add(j)
root=list(all_nodes-children_nodes)[0]
dfs(root)
```
## [MinHash 实现](http://cssyb.openjudge.cn/26hw8/1/)
使用k个不同的哈希函数，对全集合进行k次哈希，比对两个集合的相同元素数量cnt,cnt/k即为similarity.
使用Universal Hashing.(ax+b)mod m,m为2^64，即ull的自然溢出。因此随机种子用mt19937_64生成，为64位。minstd_rand为32位。
```cpp
#include<bits/stdc++.h>
using namespace std;
int n,m,q;
int k=140;
typedef unsigned long long ull;
const ull MAXM=-1ULL;
struct Hash{
    ull a,b;
};
int main(){
    scanf("%d %d %d",&n,&m,&q);
    vector<vector<int>> sets(n);
    for(int i=0;i<n;i++){
        for(int j=0;j<m;j++){
            int temp;
            scanf("%d",&temp);
            sets[i].push_back(temp);
        }
    }
    mt19937_64 gen;
    vector<Hash> hashes(k);
    for(int i=0;i<k;i++){
        hashes[i].a=gen()|1;
        hashes[i].b=gen();
    }
    vector<vector<ull>> hash_val(n,vector<ull>(k,MAXM));
    for(int i=0;i<n;i++){
        for(int j=0;j<m;j++){
            for(int l=0;l<k;l++){
                hash_val[i][l]=min(hash_val[i][l],hashes[l].a*sets[i][j]+hashes[l].b);
            }
        }
    }
    for(int i=0;i<q;i++){
        int a,b;
        scanf("%d %d",&a,&b);
        a--;
        b--;
        if(a==b){
            printf("%f\n",1.0);
            continue;
        }
        int cnt=0;
        for(int j=0;j<k;j++){
            if(hash_val[a][j]==hash_val[b][j]){
                cnt++;
            }
        }
        printf("%.4f\n",(double)cnt/k);
    }
}
```
## [汉明距离下的最近邻问题](http://cssyb.openjudge.cn/26hw9/1/)
取N个随机排列，分别找目标串的最长公共前缀(LCP)，找LCP由于是01串，可以直接对十进制数排序，找前后两个，一定是最接近的。
返回N个LCP中最长的编号。
```cpp
#include<bits/stdc++.h>
using namespace std;
typedef unsigned long long ull;
int n,q;
const int N=20;
int perms[N][64];
struct Node{
    ull val;
    int idx;
};
vector<Node> table[N];
void check(auto it, ull x,int j,int &minm,int &ans,vector<ull> &a){
    if(it!=table[j].end()){
        int d=it->idx;
        int cnt=__builtin_popcountll(a[d]^x);
        if(cnt<minm){
            minm=cnt;
            ans=d+1;
        }
    }
}
int main(){
    scanf("%d %d",&n,&q);
    vector<ull> a(n);
    for(int i=0;i<n;i++){
        scanf("%llu",&a[i]);
    }
    mt19937 gen(time(0));
    for(int i=0;i<N;i++){
        vector<int> v(64);
        for(int j=0;j<64;j++) v[j]=j;
        shuffle(v.begin(),v.end(),gen);//位数的顺序
        for(int j=0;j<64;j++) perms[i][j]=v[j];
        for(int j=0;j<n;j++){
            ull temp=0;
            ull x=a[j];
            for(int k=0;k<64;k++){
                if((x>>perms[i][k])&1){
                    temp|=(1ULL<<k);
                }
            }
            table[i].push_back({temp,j});
        }
        sort(table[i].begin(),table[i].end(),[](Node a,Node b){
            return a.val < b.val;
        });
    }
    for(int i=0;i<q;i++){
        ull x;
        int minm=65;
        int ans=1;
        scanf("%llu",&x);
        for(int j=0;j<N;j++){
            ull temp=0;
            for(int k=0;k<64;k++){
                if((x>>perms[j][k])&1){
                    temp|=(1ULL<<k);
                }
            }
            auto it=lower_bound(table[j].begin(),table[j].end(),Node{temp,-1},[](const Node &a,const Node &b){
                return a.val<b.val;
            });
            check(it,x,j,minm,ans,a);
            if(it!=table[j].begin()) check(it-1,x,j,minm,ans,a);
            if(minm==0) break;
        }
        printf("%d\n",ans);
    }
}
```
## [高维欧式空间最近邻查询](http://cssyb.openjudge.cn/26hw10/1/)
对向量随机旋转（使用Hadamard矩阵优化），并找到离它最近的坐标半轴作为哈希值。多次哈希。
对每个询问，同样哈希，并对至少一个哈希值相同的点集求距离最短值。
缩短运行时间，可以限制每次在点集上求距离的次数，同时使用普通数组替换vector，使用全局数组。
```cpp
#include<bits/stdc++.h>
using namespace std;
int d,n,q;
const int L=10;
int d1[L][64],d2[L][64],d3[L][64];
vector<int> buckets[L][128];
double tmp[64];
struct Point{
    int idx;
    double v[64];
};
void fht(double a[],int d0){
    for(int i=1;i<d0;i<<=1){//步长倍增
        for(int j=0;j<d0;j+=(i<<1)){//块间跳转
            for(int k=0;k<i;k++){//块内
                double u=a[j+k],v=a[j+k+i];
                a[j+k]=u+v;
                a[j+k+i]=u-v;
            }
        }
    }
}
int get_hash(double p[],int table_idx){
    for(int i=0;i<d;i++) tmp[i]=p[i]*d1[table_idx][i];
    fht(tmp,d);
    for(int i=0;i<d;i++) tmp[i]*=d2[table_idx][i];
    fht(tmp,d);
    for(int i=0;i<d;i++) tmp[i]*=d3[table_idx][i];
    fht(tmp,d);

    int res=0;
    double maxm=-1.0;
    for(int i=0;i<d;i++){
        if(abs(tmp[i])>maxm){
            maxm=abs(tmp[i]);
            res=i;
        }
    }
    return tmp[res]>0 ? res:res+d;
}
double dist(const double a[],const double b[]){
    double res=0;
    for(int i=0;i<d;i++){
        double diff=a[i]-b[i];
        res+=diff*diff;
    }
    return res;
}
int vis[100005];
int main(){
    scanf("%d %d %d",&d,&n,&q);
    Point points[n];
    for(int i=0;i<n;i++){
        points[i].idx=i;
        double cal=0;
        for(int j=0;j<d;j++){
            scanf("%lf",&points[i].v[j]);
            cal+=points[i].v[j]*points[i].v[j];
        }
        cal=sqrt(cal);
        for(int j=0;j<d;j++){
            points[i].v[j]/=cal;
        }
    }
    mt19937 gen(time(0));
    for(int i=0;i<L;i++){
        for(int j=0;j<d;j++){
            d1[i][j]=gen()&1 ? 1:-1;
            d2[i][j]=gen()&1 ? 1:-1;
            d3[i][j]=gen()&1 ? 1:-1;
        }
        for(int k=0;k<n;k++){
            int hash_val=get_hash(points[k].v,i);
            buckets[i][hash_val].push_back(points[k].idx);
        }
    }
    memset(vis,-1,sizeof(vis));
    for(int qaq=0;qaq<q;qaq++){
        double query[64];
        double cal=0;
        for(int i=0;i<d;i++){
            scanf("%lf",&query[i]);
            cal+=query[i]*query[i];
        }
        cal=sqrt(cal);
        for(int i=0;i<d;i++) query[i]/=cal;
        int ans=0;
        double minm=1e18;
        int check_cnt=0;
        const int max_check=1000;
        for(int i=0;i<L;i++){
            int hash_val=get_hash(query,i);
            for(int idx : buckets[i][hash_val]){
                if(vis[idx]==qaq) continue;
                vis[idx]=qaq;
                double dis=dist(points[idx].v,query);
                if(dis<minm){
                    minm=dis;
                    ans=idx;
                }
                check_cnt++;
                if(check_cnt>=max_check) break;
            }
        }
        printf("%d\n", ans);
    }
}
```
## [看上去像多态](http://cxsjsx.openjudge.cn/hw202606/A/)
基类不是虚函数的情况下，派生类命名同名函数会将其隐藏。可再次调用出来。
```cpp
#include <iostream>
using namespace std;
class B { 
	private: 
		int nBVal; 
	public: 
		void Print() 
		{ cout << "nBVal="<< nBVal << endl; } 
		void Fun() 
		{cout << "B::Fun" << endl; } 
		B ( int n ) { nBVal = n;} 
};
// 在此处补充你的代码
class D:public B{
private:
    int nDVal;
public:
    D(int n):B(3*n),nDVal(n){}
    void Fun(){
        cout<<"D::Fun"<<endl;
    }
    void Print(){
        B::Print();
        cout<<"nDVal="<<nDVal<<endl;
    }
};
int main() { 
	B * pb; D * pd; 
	D d(4); d.Fun(); 
	pb = new B(2); pd = new D(8); 
	pb -> Fun(); pd->Fun(); 
	pb->Print (); pd->Print (); 
	pb = & d; pb->Fun(); 
	pb->Print(); 
	return 0;
}
```
## [Fun和Do](http://cxsjsx.openjudge.cn/hw202606/B/)
当前类的函数未定义，调用时会向上找父类。当前类的函数为虚函数，向下看实际指向的指针类型。
```cpp
#include <iostream> 
using namespace std;
class A { 
	private: 
	int nVal; 
	public: 
	void Fun() 
	{ cout << "A::Fun" << endl; }; 
	void Do() 
	{ cout << "A::Do" << endl; } 
}; 
class B:public A { 
	public: 
	virtual void Do() 
	{ cout << "B::Do" << endl;} 
}; 
class C:public B { 
	public: 
	void Do( ) 
	{ cout <<"C::Do"<<endl; } 
	void Fun() 
	{ cout << "C::Fun" << endl; } 
}; 
void Call(
// 在此处补充你的代码
    B& p
) { 
	p.Fun(); p.Do(); 
} 
int main() { 
	C c; 
	Call( c); 
	return 0;
}
```
## [这是什么鬼delete](http://cxsjsx.openjudge.cn/hw202606/C/)
![image](https://img2024.cnblogs.com/blog/2669443/202604/2669443-20260409000938050-1447187764.png)
```cpp
#include <iostream> 
using namespace std;
class A 
{ 
public:
	A() { }
// 在此处补充你的代码
    virtual ~A(){
        cout << "destructor A" << endl;
    }
}; 
class B:public A { 
	public: 
	~B() { cout << "destructor B" << endl; } 
}; 
int main() 
{ 
	A * pa; 
	pa = new B; 
	delete pa; 
	return 0;
}
```
## [怎么又是Fun和Do](http://cxsjsx.openjudge.cn/hw202606/D/)
![image](https://img2024.cnblogs.com/blog/2669443/202604/2669443-20260409001049633-54021356.png)
![image](https://img2024.cnblogs.com/blog/2669443/202604/2669443-20260409001101517-776584163.png)
```cpp
#include <iostream>
using namespace std;
class A {
	private:
	int nVal;
	public:
	void Fun()
	{ cout << "A::Fun" << endl; };
	virtual void Do()
	{ cout << "A::Do" << endl; }
};
class B:public A {
	public:
	virtual void Do()
	{ cout << "B::Do" << endl;}
};
class C:public B {
	public:
	void Do( )
	{ cout <<"C::Do"<<endl; }
	void Fun()
	{ cout << "C::Fun" << endl; }
};
void Call(
// 在此处补充你的代码
    A * p
) {
	p->Fun(); p->Do();
}
int main() {
	Call( new A());
	Call( new C());
	return 0;
}
```
# 2026.4.9
## [简单的SumArray](http://cxsjsx.openjudge.cn/hw202608/A/)
![image](https://img2024.cnblogs.com/blog/2669443/202604/2669443-20260409133729777-989710555.png)
Template:模板，对所有类型都成立。
```cpp
#include <iostream>
#include <string>
using namespace std;
template <class T>
T SumArray(T *start,T *end){
    T res=*start;
    for(T *p=start+1;p<end;p++){
        res+=*p;
    }
    return res;
    // 在此处补充你的代码
}
int main() {
	string array[4] = { "Tom","Jack","Mary","John"};
	cout << SumArray(array,array+4) << endl;
	int a[4] = { 1, 2, 3, 4};  //提示：1+2+3+4 = 10
	cout << SumArray(a,a+4) << endl;
	return 0;
}
```
## [简单的foreach](http://cxsjsx.openjudge.cn/hw202608/B/)
函数可当参数传入。
```cpp
#include <iostream>
#include <string>
using namespace std;
// 在此处补充你的代码
template <class T,class F>
void MyForeach(T *start,T *end,F func){
    for(T *p=start;p<end;p++){
        func(*p);
    }
}
void Print(string s)
{
	cout << s;
}
void Inc(int & n)
{
	++ n;
}
string array[100];
int a[100];
int main() {
	int m,n;
	while(cin >> m >> n) {
		for(int i = 0;i < m; ++i)
			cin >> array[i];
		for(int j = 0; j < n; ++j)
			cin >> a[j];
		MyForeach(array,array+m,Print);		 
		cout << endl;
		MyForeach(a,a+n,Inc);		 
		for(int i = 0;i < n; ++i)
			cout << a[i] << ",";
		cout << endl;
	}
	return 0;
}
```
## [简单的Filter](http://cxsjsx.openjudge.cn/hw202608/C/)
template语句是定义，和后面的函数连在一起，不需要加分号。
```cpp
#include <iostream>
#include <string>
using namespace std;
// 在此处补充你的代码
template <class T1,class T2,class F>
T2 *Filter(T1 *begin,T1 *end,T2 *out,F func){
    for(T1 *p=begin;p<end;p++){
        if(func(*p)){
            *out=*p;
            out++;
        }
    }
    return out;
}
bool LargerThan2(int n)
{
	return n > 2;
}
bool LongerThan3(string s) 
{
	return s.length() > 3;
}

string as1[5] = {"Tom","Mike","Jack","Ted","Lucy"};
string as2[5];
int  a1[5] = { 1,2,3,4,5};
int a2[5];
int main() {
	string * p = Filter(as1,as1+5,as2,LongerThan3);
	for(int i = 0;i < p - as2; ++i)
		cout << as2[i];
	cout << endl; 
	int * p2 = Filter(a1,a1+5,a2,LargerThan2);
	for(int i = 0;i < p2-a2; ++i)
		cout << a2[i] << ",";
	return 0;
}
```
## [你真的搞清楚为啥 while(cin >> n) 能成立了吗？](http://cxsjsx.openjudge.cn/hw202608/D/)
``operator bool(){}`:类型转换运算符重载。定义当对象被当作bool来使用时，应该表现出什么值。
```cpp
#include <iostream>
using namespace std;
class MyCin
{
private:
    bool is_end=false;
public:
    MyCin& operator>>(int& x){
        if(is_end){
            return *this;
        }
        if(!(cin>>x)||x==-1){
            is_end=true;
        }
        return *this;
    }
    operator bool(){
        return !is_end;
    }
// 在此处补充你的代码
};
int main()
{
    MyCin m;
    int n1,n2;
    while( m >> n1 >> n2) 
        cout  << n1 << " " << n2 << endl;
    return 0;
}
```
## [山寨版istream_iterator](http://cxsjsx.openjudge.cn/hw202608/E/)
1.`istream`
2.![image](https://img2024.cnblogs.com/blog/2669443/202604/2669443-20260409143836539-405884016.png)
T operator*():解引用
3.![image](https://img2024.cnblogs.com/blog/2669443/202604/2669443-20260409143907560-1436968069.png)
```cpp
#include <iostream>
#include <string>

using namespace std;
template <class T>
class CMyistream_iterator
{
// 在此处补充你的代码
private:
    T val;
    istream &in;
public:
    CMyistream_iterator(istream &s):in(s){
        in>>val;
    }
    T operator*(){
        return val;
    }
    CMyistream_iterator operator++(int){
        in>>val;
        return *this;
    }
};
int main()  
{ 
	int t;
	cin >> t;
	while( t -- ) {
		 CMyistream_iterator<int> inputInt(cin);
		 int n1,n2,n3;
		 n1 = * inputInt; //读入 n1
		 int tmp = * inputInt;
		 cout << tmp << endl;
		 inputInt ++;   
		 n2 = * inputInt; //读入 n2
		 inputInt ++;
		 n3 = * inputInt; //读入 n3
		 cout << n1 << " " << n2<< " " << n3 << " ";
		 CMyistream_iterator<string> inputStr(cin);
		 string s1,s2;
		 s1 = * inputStr;
		 inputStr ++;
		 s2 = * inputStr;
		 cout << s1 << " " << s2 << endl;
	}
	 return 0;  
}
```
## [这个模板并不难](http://cxsjsx.openjudge.cn/hw202608/F/)
```cpp
#include <iostream>
#include <string>
#include <cstring>
using namespace std;
template <class T>  
class myclass {
// 在此处补充你的代码
private:
    T *p;
    int size;
public:
    myclass(T *a,int n){
        size=n;
        p=new T[size];
        for(int i=0;i<size;i++){
            p[i]=a[i];
        }
    }
~myclass( ) {
		delete [] p;
	}
	void Show()
	{
		for( int i = 0;i < size;i ++ ) {
			cout << p[i] << ",";
		}
		cout << endl;
	}
};
int a[100];
int main() {
	char line[100];
	while( cin >> line ) {
		myclass<char> obj(line,strlen(line));;
		obj.Show();
		int n;
		cin >> n;
		for(int i = 0;i < n; ++i)
			cin >> a[i];
		myclass<int> obj2(a,n);
		obj2.Show();
	}
	return 0;
}
```
## [排序，又见排序!](http://cxsjsx.openjudge.cn/hw202608/G/)
```cpp
#include <iostream>
using namespace std;

bool Greater2(int n1,int n2) 
{
	return n1 > n2;
}
bool Greater1(int n1,int n2) 
{
	return n1 < n2;
}
bool Greater3(double d1,double d2)
{
	return d1 < d2;
}

template <class T1,class T2>
void mysort(T1 *begin,T1 *end,T2 comp){
    for(T1 *i=begin;i<end;i++){
        for(T1 *j=i+1;j<end;j++){
            if(!comp(*i,*j)){
                swap(*i,*j);
            }
        }
    }
}
// 在此处补充你的代码
#define NUM 5
int main()
{
    int an[NUM] = { 8,123,11,10,4 };
    mysort(an,an+NUM,Greater1); //从小到大排序 
    for( int i = 0;i < NUM; i ++ )
       cout << an[i] << ",";
    mysort(an,an+NUM,Greater2); //从大到小排序 
    cout << endl;
    for( int i = 0;i < NUM; i ++ )
        cout << an[i] << ","; 
    cout << endl;
    double d[6] = { 1.4,1.8,3.2,1.2,3.1,2.1};
    mysort(d+1,d+5,Greater3); //将数组从下标1到下标4从小到大排序 
    for( int i = 0;i < 6; i ++ )
         cout << d[i] << ","; 
	return 0;
}
```
## [移除相邻字符](https://leetcode.cn/problems/resulting-string-after-adjacent-removals/description/)
移除之后，剩余字母与先前的连一起的都可以使用栈来模拟。
```python
class Solution:
    def resultingString(self, s: str) -> str:
        stk=[]
        for c in s:
            if(stk and (abs(ord(stk[-1])-ord(c))==1 or abs(ord(stk[-1])-ord(c))==25)):
                stk.pop()
            else:
                stk.append(c)
        return ''.join(stk)

print(Solution().resultingString("abc"))
```
## [网格图中机器人回家的最小代价](https://leetcode.cn/problems/minimum-cost-homecoming-of-a-robot-in-a-grid/description/)
```python
from typing import List
class Solution:
    def minCost(self, startPos: List[int], homePos: List[int], rowCosts: List[int], colCosts: List[int]) -> int:
        res=0
        if(startPos[0]>homePos[0]):
            for i in range(homePos[0],startPos[0]):
                res+=rowCosts[i]
        elif(startPos[0]<homePos[0]):
            for i in range(startPos[0]+1,homePos[0]+1):
                res+=rowCosts[i]
        if(startPos[1]>homePos[1]):
            for i in range(homePos[1],startPos[1]):
                res+=colCosts[i]
        elif(startPos[1]<homePos[1]):
            for i in range(startPos[1]+1,homePos[1]+1):
                res+=colCosts[i]
        return res

print(Solution().minCost([1, 0], [2, 3], [5, 4,3], [8, 2, 6, 7]))
```
## [机器人可以获得的最大金币数](https://leetcode.cn/problems/maximum-amount-of-money-robot-can-earn/description/)
1.记忆化搜索。函数前加@cache,哈希表存储函数中的参数组合。最后加dfs.cache_clear()以清空内存。cache只对有返回值的函数起作用。
如果是C++就手动map.
2.global:寻找全局变量。
nonlocal:寻找上一层函数的变量。
```python
from typing import List
from functools import cache
class Solution:
    def maximumAmount(self, coins: List[List[int]]) -> int:
        m=len(coins)
        n=len(coins[0])
        ans=float('-inf')
        @cache
        def dfs(x,y,k):
            if(x>=m or y>=n):
                return float('-inf')
            val=coins[x][y]
            if(x==m-1 and y==n-1):
                if(val<0 and k>0):
                    return 0
                return val
            res=val+max(dfs(x+1,y,k),dfs(x,y+1,k))
            if(val<0):
                if(k>0):
                    res=max(res,dfs(x+1,y,k-1),dfs(x,y+1,k-1))
            return res
        ans=dfs(0,0,2)
        dfs.cache_clear()
        return ans
print(Solution().maximumAmount([[0,1,-1],[1,-2,3],[2,-3,4]]))
```
# 2026.4.13
## [可以被机器人摧毁的最大墙壁数目](https://leetcode.cn/problems/maximum-walls-destroyed-by-robots/description/)
dp[i][j]记录在预判i号机器人向左/右射击的情况下，0-(i-1)号机器人能打掉的最多的墙。
因此每一轮循环计算第i号机器人左右可以打掉多少墙，并更新dp[i][j].这里可以二分计算，同时要注意左右边界，左边界为打击范围与左边机器人中的较大墙坐标，右边界需要分类讨论i+1号机器人往左打还是右打。内层j循环即i+1号机器人往哪里打。
```python
from cmath import inf
from typing import List
from bisect import bisect_left,bisect_right
class Solution:
    def maxWalls(self, robots: List[int], distance: List[int], walls: List[int]) -> int:
        a=[(0,0)]+sorted(zip(robots,distance),key=lambda x:x[0])+[(inf,0)]
        m=len(robots)
        n=len(walls)
        walls.sort()
        dp=[[0 for _ in range(2)] for _ in range(m+1)]#第i+1个机器人向左/右射击,前i个最大值
        for i in range(1,m+1):
            r=a[i][0]
            d=a[i][1]
            maxleft=max(r-d,a[i-1][0]+1)
            left=bisect_left(walls,maxleft)
            cur1=bisect_right(walls,r)
            cur2=bisect_left(walls,r)
            for j in range(2):
                if(j==0):
                    minright=min(r+d,a[i+1][0]-a[i+1][1]-1)
                else:
                    minright=min(r+d,a[i+1][0]-1)
                right=bisect_right(walls,minright)
                dp[i][j]=max(dp[i-1][0]+cur1-left,dp[i-1][1]+right-cur2)
        return max(dp[m][0],dp[m][1])

print(Solution().maxWalls([10,2],[5,1],[5,2,7]))
```
# 2026.4.14
## [二叉树的序列化与反序列化](https://leetcode.cn/problems/serialize-and-deserialize-binary-tree/description/)
使用层次遍历进行序列化与反序列化。当子节点为空时，记为null，可以唯一确定树的序列。反序列化使用指针指向当前节点的左儿子，无论是否为空每次移动两格，可以证明能够还原二叉树。
```python
class Codec:

    def serialize(self, root):
        """Encodes a tree to a single string.
        
        :type root: TreeNode
        :rtype: str
        """
        if(not root):
            return "[]"
        res=[]
        q=deque()
        q.append(root)
        while(q):
            node=q.popleft()
            if(node):
                res.append(str(node.val))
                q.append(node.left)
                q.append(node.right)
            else:
                res.append('null')
        return '['+','.join(res)+']'
        

    def deserialize(self, data):
        """Decodes your encoded data to tree.
        
        :type data: str
        :rtype: TreeNode
        """
        if(data=="['null']" or data=="[]"):
            return None
        val=data[1:-1].split(',')
        root=TreeNode(int(val[0]))
        q=deque()
        q.append(root)
        i=1
        while(q):
            node=q.popleft()
            if(val[i]!="null"):
                node.left=TreeNode(int(val[i]))
                q.append(node.left)
            i+=1
            if(val[i]!="null"):
                node.right=TreeNode(int(val[i]))
                q.append(node.right)
            i+=1
        return root  
```
## [求根节点到叶节点数字之和](https://leetcode.cn/problems/sum-root-to-leaf-numbers/description/)
```python
# Definition for a binary tree node.
from typing import Optional
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class Solution:
    def sumNumbers(self, root: Optional[TreeNode]) -> int:
        def dfs(node,sum):
            if(node==None):
                return 0
            sum=sum*10+node.val
            if(node.left==None and node.right==None):
                return sum
            return dfs(node.left,sum)+dfs(node.right,sum)
        return dfs(root,0)
print(Solution().sumNumbers(TreeNode(1,TreeNode(2),TreeNode(3))))
```
## [根据二叉树前中序序列建树](http://cs101.openjudge.cn/practice/22158/)
递归完成。先由先序遍历找到根，然后由根确定左子树和右子树，并进一步递归求解。
```python
def dfs(a,b):
    if(not a):
        return []
    root=a[0]
    idx=b.find(root)
    left=dfs(a[1:idx+1],b[0:idx])
    right=dfs(a[idx+1:],b[idx+1:])
    return left+right+[root]
while(True):
    try:
        preorder=input()
        postorder=input()
        n=len(preorder)
        print(''.join(dfs(preorder,postorder)))
    except EOFError:
        break
```
## [括号嵌套树](http://cs101.openjudge.cn/practice/24729/)
```python
class TreeNode:
    def __init__(self,val=0,children=[]):
        self.val=val
        self.children=children
def preorder(node):
    if(node==None):
        return []
    res=[node.val]
    for i in node.children:
        res+=preorder(i)
    return res
def postorder(node):
    if(node==None):
        return []
    res=[]
    for i in node.children:
        res+=postorder(i)
    res.append(node.val)
    return res
a=input()
s=[]
n=len(a)
for i in a:
    if(ord('A')<=ord(i)<=ord('Z')):
        s.append(TreeNode(i))
    elif(i=='('):
        s.append(i)
    elif(i==')'):
        temp=[]
        while(s[-1]!='('):
            node=s.pop()
            temp.append(node)
        s.pop()
        s[-1].children=temp[::-1]
print(''.join(preorder(s[0])))
print(''.join(postorder(s[0])))
```
## [Falling Leaves](http://cs101.openjudge.cn/practice/01577/)
从根节点开始，将每一层的数依次插入BST中。插入的方法可以递归解决。
```python
class TreeNode:
    def __init__(self,val="",left=None,right=None):
        self.val=val
        self.left=left
        self.right=right
def insert(root,val):
    if(root==None):
        return TreeNode(val)
    if(val<root.val):
        root.left=insert(root.left,val)
    else:
        root.right=insert(root.right,val)
    return root

def preorder(node):
    if(node==None):
        return []
    return [node.val]+preorder(node.left)+preorder(node.right)
qaq='*'
while(qaq=='*'):
    s=[]
    while(True):
        t=input()
        if(t=='*' or t=='$'):
            qaq=t
            break
        s.append(t)
    n=len(s)
    if(n==0):
        break
    for i in range(n-1,-1,-1):
        t=s[i]
        if(i!=n-1):
            for j in t:
                insert(root,j)
        if(i==n-1):
            root=TreeNode(t[0])
    print(''.join(preorder(root)))
```
## [Apple Tree](https://codeforces.com/problemset/problem/1843/D)
即求每个节点对应的叶子节点个数。dfs求解即可，注意用邻接表存树需判断是父节点还是子节点。
```python
import sys
sys.setrecursionlimit(10**6)
t=int(input())
def dfs(parent,x):
    if(len(a[x])==1 and a[x][0]==parent):
        ans[x]=1
    for i in a[x]:
        if(i!=parent):
            dfs(x,i)
            ans[x]+=ans[i]

for _ in range(t):
    n=int(input())
    a=[[]for _ in range(n+1)]
    ans=[0 for _ in range(n+1)]
    for i in range(n-1):
        u,v=map(int,input().split())
        a[u].append(v)
        a[v].append(u)
    q=int(input())
    dfs(0,1)
    for i in range(q):
        u,v=map(int,input().split())
        print(ans[u]*ans[v])
```
# 2026.4.15
## [二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/description/)
递归。
```python
from typing import Optional
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if(root==None):
            return 0
        return max(self.maxDepth(root.left),self.maxDepth(root.right))+1
```
## [翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/description/)
```python
from typing import Optional
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if(root==None):
            return None
        root.left,root.right=root.right,root.left
        self.invertTree(root.left)
        self.invertTree(root.right)
        return root
```
## [二叉搜索树中第 K 小的元素](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/description/)
对BST,中序遍历是按照顺序来的。中序遍历，到第k个返回即可。
```python
from typing import Optional
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        s=[]
        while(root!=None or len(s)!=0):
            while(root!=None):
                s.append(root)
                root=root.left
            root=s.pop()
            k-=1
            if(k==0):
                return root.val
            root=root.right
print(Solution().kthSmallest(TreeNode(3,TreeNode(1),TreeNode(4)),1))
```
## [模拟行走机器人](https://leetcode.cn/problems/walking-robot-simulation/description/)
多维列表转成set时要将内部元素变为tuple类型(hashable)
```python
from typing import List
class Solution:
    def robotSim(self, commands: List[int], obstacles: List[List[int]]) -> int:
        n=len(commands)
        m=len(obstacles)
        qwq=set(map(tuple,obstacles))
        dx=[0,1,0,-1]
        dy=[1,0,-1,0]
        res=0
        x=0
        y=0
        dir=0
        for i in range(n):
            k=commands[i]
            if(k==-2):
                dir=(dir+3)%4
            elif(k==-1):
                dir=(dir+1)%4
            else:
                for j in range(k):
                    if((x+dx[dir],y+dy[dir]) in qwq):
                        break
                    x+=dx[dir]
                    y+=dy[dir]
            res=max(res,x*x+y*y)
        return res

print(Solution().robotSim([4,-1,3], []))
```
## [模拟行走机器人 II](https://leetcode.cn/problems/walking-robot-simulation-ii/)
机器人只在边界上走，判断在哪条边上即可。注意特判原点，出发时向东，返回时向南。
```python
from typing import List
class Robot:
    def __init__(self, width: int, height: int):
       self.w=width
       self.h=height
       self.s=0 

    def step(self, num: int) -> None:
        self.s+=num

    def getPos(self) -> List[int]:
        a=(self.h+self.w)*2-4
        t=self.s%a
        if(0<=t<self.w):
            return [t,0]
        elif(self.w<=t<=self.w+self.h-2):
            return [self.w-1,t+1-self.w]
        elif(self.w+self.h-1<=t<=self.w+self.h+self.w-3):
            return [a-self.h-t+1,self.h-1]
        else:
            return [0,a-t]

    def getDir(self) -> str:
        a=(self.h+self.w)*2-4
        t=self.s%a
        if(self.s==0):
            return "East"
        else:
            if(0<t<self.w):
                return "East"
            elif(self.w<=t<=self.w+self.h-2):
                return "North"
            elif(self.w+self.h-1<=t<=self.w+self.h+self.w-3):
                return "West"
            else:
                return "South"

# Your Robot object will be instantiated and called as such:
obj = Robot(6,3)
obj.step(2)
obj.step(2)
print(obj.getPos())
print(obj.getDir())
obj.step(2)
obj.step(1)
obj.step(4)
print(obj.getPos())
print(obj.getDir())
```
## [打家劫舍 II](https://leetcode.cn/problems/house-robber-ii/description/)
dp数组记录0-i能打到的最大数量。dp[i]=max(dp[i-1],dp[i-2]+a[i]).
第一家偷或不偷，即对前n-1家与后n-1家分别dp求最大值。
```python
from typing import List
class Solution:
    def rob(self, nums: List[int]) -> int:
        if(len(nums)==1):
            return nums[0]
        def get(a):
            n=len(a)
            dp=[0]*n
            dp[0]=a[0]
            if(n==1):
                return dp[0]
            dp[1]=max(a[0],a[1])
            for i in range(2,n):
                dp[i]=max(dp[i-1],dp[i-2]+a[i])
            return dp[n-1]
        return max(get(nums[:-1]), get(nums[1:]))

print(Solution().rob([2,3,2]))
```
## [产生至少 K 个峰值的最少操作次数](https://leetcode.cn/problems/minimum-operations-to-achieve-at-least-k-peaks/description/)
由于峰值必须亮亮间隔，每个点到达峰值的操作数固定，题目转化为求k个不相邻数的最小值。
1.dp[i][j]:0-i，j个不相邻数的最小值。同打家劫舍II.
2.贪心+反悔。使用小根堆，每次取堆顶，并标记左右两边的数。将这个值更新为左右的值加和减去该值，重新放入堆中，并更新左右数的坐标。
复杂度O(n)+O(klogn)=O(nlogn)
```python
import heapq
class Solution:
    def minOperations(self, nums: list[int], k: int) -> int:
        n=len(nums)
        if(n//2<k):
            return -1
        a=[0]*n
        for i in range(n):
            p=nums[i-1]
            q=nums[i]
            r=nums[(i+1)%n]           
            a[i]=max(0,max(p,r)+1-q)
        l=[0]*n
        r=[0]*n
        for i in range(n):
            l[i]=(i-1+n)%n
            r[i]=(i+1)%n
        q=[]
        heapq.heapify(q)
        for i in range(n):
            heapq.heappush(q,(a[i],i))
        vis=[0]*n
        ans=0
        cnt=0
        while(cnt<k):
            if(not q):
                return -1
            val,idx=heapq.heappop(q)
            if(vis[idx]):
                continue
            ans+=val
            vis[l[idx]]=1
            vis[r[idx]]=1
            a[idx]=a[l[idx]]+a[r[idx]]-val
            heapq.heappush(q,(a[idx],idx))
            l[idx]=l[l[idx]]
            r[idx]=r[r[idx]]
            l[r[idx]]=idx
            r[l[idx]]=idx
            cnt+=1
        return ans
print(Solution().minOperations([2,1,2],1))
```
# 2026.4.16
## [括号嵌套二叉树](http://cs101.openjudge.cn/practice/27637/)
```python
class TreeNode:
    def __init__(self,val="",left=None,right=None):
        self.val=val
        self.left=left
        self.right=right
def preorder(root):
    if(root==None):
        return []
    return [root.val]+preorder(root.left)+preorder(root.right)
def inorder(root):
    if(root==None):
        return []
    return inorder(root.left)+[root.val]+inorder(root.right)
n=int(input())
for _ in range(n):
    a=input()
    s=[]
    for i in a:
        if(i==')'):
            temp=[]
            while(s and s[-1]!='('):
                temp.append(s.pop())
            s.pop()
            node=s[-1]
            # node.left=temp[-1] if 'A'<=temp[-1].val<='Z' else None
            # node.right=temp[0] if 'A'<=temp[0].val<='Z' else None
            node.left=temp[-1]
            node.right=temp[0]
        elif(i>='A' and i<='Z'):
            s.append(TreeNode(i))
        elif(i=='*'):
            s.append(None)
        else:
            s.append(i)
    root=s[0]
    print("".join(preorder(root)))
    print("".join(inorder(root)))
```
## [扫雷游戏](https://leetcode.cn/problems/minesweeper/description/)
```python
from typing import List
class Solution:
    def updateBoard(self, board: List[List[str]], click: List[int]) -> List[List[str]]:
        m=len(board)
        n=len(board[0])
        dx=[0,-1,-1,-1,0,1,1,1]
        dy=[-1,-1,0,1,1,1,0,-1]
        def dfs(x,y):
            if(board[x][y]=='X'):
                return
            elif(board[x][y]=='M'):
                board[x][y]='X'
                return
            elif(board[x][y]=='E'):
                cnt=0
                for i in range(8):
                    xx=x+dx[i]
                    yy=y+dy[i]
                    if(0<=xx<m and 0<=yy<n):
                        if(board[xx][yy]=='M'):
                            cnt+=1
                if(cnt>0):
                    board[x][y]=str(cnt)
                else:
                    board[x][y]="B"
                    for i in range(8):
                        xx=x+dx[i]
                        yy=y+dy[i]
                        if(0<=xx<m and 0<=yy<n):
                            dfs(xx,yy)
            return
        dfs(click[0],click[1])
        return board
print(Solution().updateBoard([["E","E","E","E","E"],["E","E","M","E","E"],["E","E","E","E","E"],["E","E","E","E","E"]],[3,0]))
```
## [Kefa and Park](https://codeforces.com/contest/580/problem/C)
邻接表存树，遍历时加上父亲以便判断，或加入vis数组。
```python
import sys
sys.setrecursionlimit(10**7)
n,m=map(int,input().split())
a=[0]+list(map(int,input().split()))
tree=[[] for _ in range(n+1)]
vis=[0]*(n+1)
ans=0
def dfs(x,k,stat):
    global ans
    if(k>m):
        return
    flag=0
    for i in tree[x]:
        if(not vis[i]):
            flag=1
            vis[i]=1
            if(a[i]==1 and stat==1):
                dfs(i,k+1,1)
            elif(a[i]==1 and stat==0):
                dfs(i,1,1)
            else:
                dfs(i,0,0)
    if(flag==0):
        ans+=1
        return

for i in range(n-1):
    u,v=map(int,input().split())
    tree[u].append(v)
    tree[v].append(u)
vis[1]=1
if(a[1]==1):
    dfs(1,1,1)
else:
    dfs(1,0,0)
print(ans)
```
## [Shell排序](http://cs101.openjudge.cn/practice/15265/)
插入排序：左边的数列有序，每次将右边的数一下一下往左边挪，直到找到合适的位置插入。
希尔排序：将数列分为gap组，0-gap-1即为每组第一个元素，每次向左移动gap个位置，这样保证每组有序。
gap由Hibbard增量序列生成，最后gap=1相当于插入排序。每次元素能跳得更多，保证效率。
```python
n=int(input())
a=list(map(int,input().split()))
h=[]
i=1
gap=1
while(gap<=n):
    h.append(gap)
    i+=1
    gap=(1<<i)-1
h.reverse()
for gap in h:
    for i in range(gap,n):
        temp=a[i]
        j=i
        while(j>=gap and a[j-gap]>temp):
            a[j]=a[j-gap]
            j-=gap
        a[j]=temp
    print(" ".join(map(str,a)))
```
## [【模板】ST 表 & RMQ 问题](https://www.luogu.com.cn/problem/P3865)
st[i][j]存放以i为起点，长度为(1<<j)的字段中的最值。
```python
from math import log2
import sys
def solve():
    data=sys.stdin.read().split()
    if(not data):
        return
    it=iter(data)
    n=int(next(it))
    m=int(next(it))
    a=[int(next(it)) for _ in range(n)]
    st=[[0 for _ in range(int(log2(n))+1)] for _ in range(n)]#i为起点，长度为2^j
    log=[0]
    for i in range(1,n+1):
        log.append(int(log2(i)))
    for j in range(log[n]+1):
        for i in range(n-(1<<j)+1):
            if(j==0):
                st[i][j]=a[i]
            else:
                st[i][j]=max(st[i][j-1],st[i+(1<<(j-1))][j-1])
    res=[]
    for qaq in range(m):
        l=int(next(it))
        r=int(next(it))
        l-=1
        r-=1
        k=int(log[r-l+1])
        print(max(st[l][k],st[r-(1<<k)+1][k]))
if(__name__=="__main__"):
    solve()
```
## [goodcopy](http://cxsjsx.openjudge.cn/hw202609/A/)
如果新位置与原先长度有重叠，复制时需从后往前，否则从前往后。重载()即可。
```cpp
#include <iostream>
using namespace std;


template <class T>
struct GoodCopy {
// 在此处补充你的代码
    void operator()(T *start,T *end,T *dest){
        int n=end-start;
        if(dest>start && dest<end){
            for(int i=n-1;i>=0;i--){
                dest[i]=start[i];
            }
        }
        else{
            for(int i=0;i<n;i++){
                dest[i]=start[i];
            }
        }
    }
};

int a[200];
int b[200];
string c[200];
string d[200];

template <class T>
void Print(T s,T e) {
	for(; s != e; ++s)
		cout << * s << ",";
	cout << endl;
}

int main()
{
	int t;
	cin >> t;
	while( t -- ) {
		int m ;
		cin >> m;
		for(int i = 0;i < m; ++i)
			cin >> a[i];
		GoodCopy<int>()(a,a+m,b);
		Print(b,b+m);
		GoodCopy<int>()(a,a+m,a+m/2);
		Print(a+m/2,a+m/2 + m);

		for(int i = 0;i < m; ++i)
			cin >> c[i];
		GoodCopy<string>()(c,c+m,d);
		Print(c,c+m);
		GoodCopy<string>()(c,c+m,c+m/2);
		Print(c+m/2,c+m/2 + m);
	}
	return 0;
}
```
## [按距离排序](http://cxsjsx.openjudge.cn/hw202609/B/)
target与distance分别传入，然后重载括号，返回大小关系。
```cpp
#include <iostream>
#include <cmath>
#include <algorithm>
#include <string>
using namespace std;
template <class T1,class T2>
struct Closer {
// 在此处补充你的代码
    T1 target;
    T2 distance;
    Closer(T1 t,T2 d):target(t),distance(d){}
    bool operator()(const T1 &a,const T1 &b){
        int d1=distance(a,target);
        int d2=distance(b,target);
        if(d1==d2){
            return a<b;
        }
        return d1<d2;
    }
};

int Distance1(int n1,int n2) {
	return abs(n1-n2);
}
int Distance2(const string & s1, const string & s2)
{
	return abs((int)s1.length()- (int) s2.length());
}
int a[10] = { 0,3,1,4,7,9,20,8,10,15};
string b[6] = {"American","Jack","To","Peking","abcdefghijklmnop","123456789"};
int main()
{
	int n;string s;
	while( cin >> n >> s ) {
		sort(a,a+10,Closer<int ,int (*)(int ,int)> (n,Distance1));
		for(int i = 0;i < 10; ++i)
			cout << a[i] << "," ;
		cout << endl;
		sort(b,b+6,Closer<string,int (*)(const string &,const string &  )> (s,Distance2)); 
		for(int i = 0;i < 6; ++i)
			cout << b[i] << "," ;
		cout << endl;
	}
	return 0;
}
```
## [白给的list排序](http://cxsjsx.openjudge.cn/hw202609/E/)
```cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <list>
using namespace std;
int main()
{	
	double a[] = {1.2,3.4,9.8,7.3,2.6};
	list<double> lst(a,a+5);
	lst.sort(
// 在此处补充你的代码
        [](double x,double y){
            return x>y;
        }
);
	
	for(list<double>::iterator i  = lst.begin(); i != lst.end(); ++i) 
		cout << * i << "," ;
    return 0;
}
```
## [函数对象的过滤器](http://cxsjsx.openjudge.cn/hw202609/D/)
结构体A已经重载了<，因此使用小于即可。
```cpp
#include <iostream>
#include <vector>
using namespace std;


struct A {
	int v;
	A() { }
	A(int n):v(n) { };
	bool operator<(const A & a) const {
		return v < a.v;
	}
};
// 在此处补充你的代码
template<class T>
class FilterClass{
private:
    T low,high;
public:
    FilterClass(T l,T h):low(l),high(h){}
    bool operator()(const T& a){
        return low<a && a<high;
    }
};
template <class T>
void Print(T s,T e)
{
	for(;s!=e; ++s)
		cout << *s << ",";
	cout << endl;
}
template <class T1, class T2,class T3>
T2 Filter( T1 s,T1 e, T2 s2, T3 op) 
{
	for(;s != e; ++s) {
		if( op(*s)) {
			* s2 = * s;
			++s2;
		}
	}
	return s2;
}

ostream & operator <<(ostream & o,A & a)
{
	o << a.v;
	return o;
}
vector<int> ia;
vector<A> aa; 
int main()
{
	int m,n;
	while(cin >> m >> n) {
		ia.clear();
		aa.clear(); 
		int k,tmp;
		cin >> k;
		for(int i = 0;i < k; ++i) {
			cin >> tmp; 
			ia.push_back(tmp);
			aa.push_back(tmp); 
		}
		vector<int> ib(k);
		vector<A> ab(k);
		vector<int>::iterator p =  Filter(ia.begin(),ia.end(),ib.begin(),FilterClass<int>(m,n));
		Print(ib.begin(),p);
		vector<A>::iterator pp = Filter(aa.begin(),aa.end(),ab.begin(),FilterClass<A>(m,n));
		Print(ab.begin(),pp);
		
	}
	return 0;
}
```
# 2026.4.17
## [我自己的 ostream_iterator](http://cxsjsx.openjudge.cn/hw202609/F/)
1.*x=*s:重载=和*，接收到之后就打印。
2.重载前置++，返回对象本身即可。（std::ostream（输出流）本身就具有“自动推进”的属性。）
```cpp
#include <iostream>
#include <list>
#include <string>
using namespace std;

template <class T1,class T2>
void Copy(T1 s,T1 e, T2 x)
{
	for(; s != e; ++s,++x)
		*x = *s;
}

 
template<class T>
class myostream_iteraotr
{
// 在此处补充你的代码
private:
    ostream &os;
    string sep;
public:
    myostream_iteraotr(ostream &a,string s=""):os(a),sep(s){}
    myostream_iteraotr& operator*(){
        return *this;
    }
    myostream_iteraotr<T>& operator=(const T &x){
        os << x << sep;
        return *this;
    }
    myostream_iteraotr<T>& operator++(){
        return *this;    
    }
    myostream_iteraotr<T> operator++(int){
        return *this;
    }
};


int main()
{	const int SIZE = 5;
	int a[SIZE] = {5,21,14,2,3};
	double b[SIZE] = { 1.4, 5.56,3.2,98.3,3.3};
	list<int> lst(a,a+SIZE);
	myostream_iteraotr<int> output(cout,",");
	Copy( lst.begin(),lst.end(),output); 
	cout << endl;
	myostream_iteraotr<double> output2(cout,"--");
	Copy(b,b+SIZE,output2);
	return 0;
}
```
## [很难蒙混过关的CArray3d三维数组模板类](http://cxsjsx.openjudge.cn/hw202609/C/)
![image](https://img2024.cnblogs.com/blog/2669443/202604/2669443-20260417172857682-647491314.png)
```cpp
#include <iostream>
#include <iomanip> 
#include <cstring>
using namespace std;
template <class T>
class CArray3D
{
// 在此处补充你的代码
private:
    int x,y,z;
    T* data;
    class CArray2D{
    private:
        T *pstart;
        int rowsize;
    public:
        CArray2D(T *p,int rs):pstart(p),rowsize(rs){}
        T* operator[](int j){
            return pstart+j*rowsize;
        }
        operator T*(){
            return pstart;
        }
    };
public:
    CArray3D(int x,int y,int z):x(x),y(y),z(z){
        data=new T(x*y*z);
    }
    ~CArray3D(){
        if(data) delete[] data;
    }
    CArray2D operator[](int i){
        return CArray2D(data+i*x*y,y);
    }
};

CArray3D<int> a(3,4,5);
CArray3D<double> b(3,2,2);
void PrintA()
{
	for(int i = 0;i < 3; ++i) {
		cout << "layer " << i << ":" << endl;
		for(int j = 0; j < 4; ++j) {
			for(int k = 0; k < 5; ++k) 
				cout << a[i][j][k] << "," ;
			cout << endl;
		}
	}
}
void PrintB()
{
	for(int i = 0;i < 3; ++i) {
		cout << "layer " << i << ":" << endl;
		for(int j = 0; j < 2; ++j) {
			for(int k = 0; k < 2; ++k) 
				cout << b[i][j][k] << "," ;
			cout << endl;
		}
	}
}

int main()
{

	int No = 0;
	for( int i = 0; i < 3; ++ i ) {
		a[i];
		for( int j = 0; j < 4; ++j ) {
			a[j][i];
			for( int k = 0; k < 5; ++k )
				a[i][j][k] = No ++;
			a[j][i][i];	
		}
	}
	PrintA();
	memset(a[1],-1 ,20*sizeof(int));	
	memset(a[1],-1 ,20*sizeof(int));
	PrintA(); 
	memset(a[1][1],0 ,5*sizeof(int));	
	PrintA();

	for( int i = 0; i < 3; ++ i )
		for( int j = 0; j < 2; ++j )
			for( int k = 0; k < 2; ++k )
				b[i][j][k] = 10.0/(i+j+k+1);
	PrintB();
	int n = a[0][1][2];
	double f = b[0][1][1];
	cout << "****" << endl;
	cout << n << "," << f << endl;
		
	return 0;
}
```
## [【模板】最近公共祖先（LCA）](https://www.luogu.com.cn/problem/P3379)
1.dfn.
![image](https://img2024.cnblogs.com/blog/2669443/202604/2669443-20260417181012724-2103193428.png)
先dfs求出dfn与每个点的深度，然后使用st表存储dfn意义上每个节点的深度的区间最小值。对于答案，输出l+1至r的深度最小的节点的父节点即可。
```python
from math import log2
import sys
sys.setrecursionlimit(10**7)
n,m,root=map(int,input().split())
tree=[[] for _ in range(n+1)]
dfn=[0]*(n+1)
dep=[0]*(n+1)
seq=[0]*(n+1)#seq[dfn[i]]
p=[0]*(n+1)
timer=0
def dfs(parent,node,depth):
    global timer
    timer+=1
    dfn[node]=timer
    seq[timer]=node
    p[node]=parent
    dep[node]=depth
    for i in tree[node]:
        if(i!=parent):
            dfs(node,i,depth+1)
for i in range(n-1):
    x,y=map(int,input().split())
    tree[x].append(y)
    tree[y].append(x)
dep[0]=dfn[0]=float('inf')
dfs(0,root,0)
log=[0]*(n+1)
for i in range(1,n+1):
    log[i]=int(log2(i))
st=[[0 for _ in range(log[n]+1)] for _ in range(n+1)]
for i in range(1,n+1):
    st[i][0]=seq[i]
for j in range(1,log[n]+1):
    for i in range(1,n-(1<<j)+2):
        if(dep[st[i][j-1]]<dep[st[i+(1<<(j-1))][j-1]]):
            st[i][j]=st[i][j-1]
        else:
            st[i][j]=st[i+(1<<(j-1))][j-1]
def lca(x,y):
    if(x==y):
        return x
    l=dfn[x]
    r=dfn[y]
    if(l>r):
        l,r=r,l
    l+=1
    k=log[r-l+1]
    a=st[l][k]
    b=st[r-(1<<k)+1][k]
    if(dep[a]<dep[b]):
        return p[a]
    else:
        return p[b]
for _ in range(m):
    x,y=map(int,input().split())
    print(lca(x,y))
```
2.倍增lca
up[i][j]存储i的2^j祖先。使x和y跳到相同高度，然后一起往上跳，直到跳到同一点为止。往上跳的过程从大的间距到小的间距，以便刚好跳到lca.
```python
from math import log2
import sys
sys.setrecursionlimit(10**7)
def dfs(parent,node,depth):
    p[node]=parent
    dep[node]=depth
    for i in tree[node]:
        if(i!=parent):
            dfs(node,i,depth+1)
n,m,root=map(int,input().split())
tree=[[] for _ in range(n+1)]
for i in range(n-1):
    x,y=map(int,input().split())
    tree[x].append(y)
    tree[y].append(x)
max_log=20
up=[[0 for _ in range(max_log)]for _ in range(n+1)]#i的2^j祖先
dep=[0]*(n+1)
p=[0]*(n+1)
dfs(0,root,0)
for i in range(1,n+1):
    up[i][0]=p[i]
for j in range(1,max_log):
    for i in range(1,n+1):
        up[i][j]=up[up[i][j-1]][j-1]
def lca(x,y):
    if(dep[x]<dep[y]):
        x,y=y,x
    diff=dep[x]-dep[y]
    for i in range(max_log):
        if((diff>>i)&1):
            x=up[x][i]
    if(x==y):
        return x
    for i in range(max_log-1,-1,-1):
        if(up[x][i]!=up[y][i]):
            x=up[x][i]
            y=up[y][i]
    return p[x]
for _ in range(m):
    x,y=map(int,input().split())
    print(lca(x,y))
```
# 2026.4.27
## [Cipher](http://cs101.openjudge.cn/practice/01026/)
帮室友调题。
由于k值较大因此考虑直接找循环。
```python
def op(n,a,t):
    res=["**"]*n
    for i in range(n):
        res[a[i]-1]=t[i]
    ans=""
    for i in range(n):
        if(res[i]!="**"):
            ans+=res[i]
    return ans

while(True):
    n=int(input())
    if(n==0):
        break
    a=list(map(int,input().split()))
    cycles=[]
    for i in range(n):
        temp=[]
        cur=-1
        while(cur!=i):
            if(cur==-1):
                cur=i
            temp.append(cur)
            cur=a[cur]-1
        cycles.append(temp)
    while(True):
        s=input()
        if(s=='0'):
            break
        idx=s.find(" ")
        k=int(s[:idx])
        t=s[idx+1:]
        t=t+" "*(n-len(t))
        res=["**"]*n
        for i in range(n):
            res[cycles[i][k%len(cycles[i])]]=t[i]
        ans=""
        for i in range(n):
            if(res[i]!="**"):
                ans+=res[i]
        print(ans)
    print()
```
cycle逻辑优化版：
```python
visited = [False] * n
for i in range(n):
    if not visited[i]:
        cycle = []
        j = i
        while not visited[j]:
            visited[j] = True
            cycle.append(j)
            j = keys[j] - 1
        l = len(cycle)
        for idx, val in enumerate(cycle):
            final_pos[val] = cycle[(idx+k) % l]
```

# 2026.4.30
## [高阶函数F(x)](http://cxsjsx.openjudge.cn/hw202612/A/)
![image](https://img2024.cnblogs.com/blog/2669443/202604/2669443-20260430234517929-1856645762.png)
题目要求函数的返回值能够接着被调用，而lambda作为一个闭包科可以被传出去。
![image](https://img2024.cnblogs.com/blog/2669443/202604/2669443-20260430235114674-455585607.png)
按值捕获：直接捕获先前定义的值，拷贝一份副本
按引用捕获
```cpp
#include <iostream>
using namespace std;
// 在此处补充你的代码
template <class T1,class T2>
auto f(T1 n){
    return [n](T2 x){
        return x+n;
    };
}

int main()
{
   cout << f<int,int>(7)(9) << endl;   //16
   cout << f<string,string> (" hello!")("world")  <<endl; // world hello!
   cout << f<char,string> ('!')("world") << endl;
   
   
   return 0;    //world!
}
```
## [高阶函数Combine](http://cxsjsx.openjudge.cn/hw202612/B/)
```cpp
#include <iostream>
using namespace std;
// 在此处补充你的代码
template <class T1,class T2,class T3>
auto combine(T1 f1,T2 f2){
    return [f1,f2](T3 x){
        return f1(f1(x)+f2(x));
    };
}
int main()
{
    auto Square = [] (double a) { return a * a; };
    auto Inc = [] (double a) { return a + 1; };
    cout << combine<decltype(Square),decltype(Inc),int>(Square,Inc)(3) << endl;
    cout << combine<decltype(Inc),decltype(Square),double>(Inc,Square)(2.5) << endl;

    return 0;
}
```
## [自己实现bitset](http://cxsjsx.openjudge.cn/hw202612/C/)
![image](https://img2024.cnblogs.com/blog/2669443/202605/2669443-20260501000547709-981140827.png)
```cpp
#include <iostream>
#include <cstring>
using namespace std;
template <int bitNum>
struct MyBitset 
{
	char a[bitNum/8+1];
	MyBitset() { memset(a,0,sizeof(a));};
	void Set(int i,int v) {
		char & c = a[i/8];
		int bp = i % 8;
		if( v ) 
			c |= (1 << bp);
		else 
			c &= ~(1 << bp);
	}
// 在此处补充你的代码
struct BitProxy {
    MyBitset & b;
    int pos;
    BitProxy(MyBitset & bs, int p) : b(bs), pos(p) {}

    BitProxy& operator=(int v) {
        b.Set(pos, v);
        return *this;
    }

    operator int() const {
        char c = b.a[pos / 8];
        return (c >> (pos % 8)) & 1;
    }

    BitProxy& operator=(const BitProxy & other) {
        b.Set(pos, (int)other);
        return *this;
    }
};
BitProxy operator[](int i) {
    return BitProxy(*this, i);
}

void Print() {
		for(int i = 0;i < bitNum; ++i) 
			cout << (*this) [i];
		cout << endl;
	}

};

int main()
{
	int n;
	int i,j,k,v;
	while( cin >>  n) {
		MyBitset<20> bs;
		for(int i = 0;i < n; ++i) {
			int t;
			cin >> t;
			bs.Set(t,1);
		}
		bs.Print();
		cin >> i >> j >> k >> v;
		bs[k] = v;
		bs[i] = bs[j] = bs[k];
		bs.Print();
		cin >> i >> j >> k >> v;
		bs[k] = v;
		(bs[i] = bs[j]) = bs[k];
		bs.Print();
	}
	return 0;
}
```