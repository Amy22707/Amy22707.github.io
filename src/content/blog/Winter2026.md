---
title: 2026寒假做题记录
description: 2026.1-2026.2
publishedAt: 2026-01-12
tags:
  - 算法
  - Python
  - Cpp
---
# 2026.1.12
## [完美的爱](http://cs101.openjudge.cn/practice/27141/)
上学期每日选做的最后一题。太过摆烂导致拖到现在甚至是凌晨写掉的。
全部减520，即求前缀和相同的两个数。扫一遍即可。
```python
from collections import defaultdict
n=int(input())
a=list(map(int,input().split()))
for i in range(n):
    a[i]-=520
pre=0
sums=defaultdict(list)
sums[0].append(-1)
ans=0
for i in range(n):
    pre+=a[i]
    if(pre in sums):
        ans=max(ans,i-sums[pre][0])
    sums[pre].append(i)
print(ans*520)
```
# 2026.1.14
## [两数之和](https://leetcode.cn/problems/two-sum/description/)
复健C++。
1.函数最后需要return一个空数组，否则编译不通过。如果删除循环中的i<n亦可。
![image](https://img2024.cnblogs.com/blog/2669443/202601/2669443-20260114221316229-1350667137.png)
2.测试数据的方式：将Solution实例化，并调用函数。函数中的参数必须是形参而不能是实际的值，因为`vector<int>&`表示对一个vector数组的引用。如果使用数组副本`vector<int>`或const引用`const vector<int>`则可以传值。
3.C++数组不能直接输出。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        int n=nums.size();
        for(int i=0;i<n;i++){
            for(int j=i+1;j<n;j++){
                if(nums[i]+nums[j]==target){
                    return {i,j};
                }
            }
        }
        return {};
    }
};
int main(){
    Solution sol;
    vector<int> nums={2,7,11,15};
    int target=9;
    vector<int> t=sol.twoSum(nums,target);
    for(int i=0;i<t.size();i++){
        cout<<t[i]<<" ";
    }
    return 0;
}
```
哈希做法
1.`unordered_map<int,int>`
2.`.find()`在key中查找，用`auto`(自动推导类型），如果找到则返回目标值的迭代器(unordered_map<Key, T>::iterator)，否则返回`hash.end()`(尾后迭代器，不指向任何元素)，因此需要先判断。
3.it->first返回键，it->second返回值。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int,int> idx;
        for(int i=0;;i++){
            auto t=idx.find(target-nums[i]);
            if(t!=idx.end()){
                return{t->second,i};
            }
            idx[nums[i]]=i;
        }
    }
};
int main(){
    Solution sol;
    vector<int> nums={2,7,11,15};
    int target=9;
    vector<int> t=sol.twoSum(nums,target);
    for(int i=0;i<t.size();i++){
        cout<<t[i]<<" ";
    }
    return 0;
}
```
# 2026.1.19
## [三数之和](https://leetcode.cn/problems/3sum/)
固定i，j与k双指针。
`.push_back()`
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(),nums.end());
        vector<vector<int>> ans;
        int n=nums.size();
        int i,j,k;
        for(int i=0;i<n-2;i++){
            if(i>0 and nums[i]==nums[i-1]){
                continue;
            }
            j=i+1;
            k=n-1;
            while(j<k){
                if(nums[i]+nums[j]+nums[k]==0){
                    ans.push_back({nums[i],nums[j],nums[k]});
                    j++;
                    k--;
                    while(nums[j]==nums[j-1] and j<k){
                        j++;
                    }
                    while(nums[k]==nums[k+1] and j<k){
                        k--;
                    }
                }
                else if(nums[i]+nums[j]+nums[k]<0){
                    j++;
                }
                else{
                    k--;
                }
            }
        }
        return ans;
    }
};
int main(){
    Solution sol;
    vector<int> nums={-1,0,1,2,-1,-4};
    vector<vector<int>> result=sol.threeSum(nums);
    for(int i=0;i<result.size();i++){
        for(int j=0;j<result[i].size();j++){
            cout<<result[i][j]<<" ";
        }
        cout<<endl;
    }
}
```
## [接雨水](https://leetcode.cn/problems/trapping-rain-water/description/?envType=study-plan-v2&envId=top-100-liked)
`stack<int>`
`.pop()` `.push()` `.empty()`
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int trap(vector<int>& height) {
        int n=height.size();
        stack<int> s;
        int ans=0;
        for(int i=0;i<n;i++){
            while(!s.empty()&&height[i]>height[s.top()]){
                int top=s.top();
                s.pop();
                if(s.empty()){
                    break;
                }
                int left=s.top();
                ans+=(i-left-1)*(min(height[left],height[i])-height[top]);
            }
            s.push(i);
        }
        return ans;
    }
};
int main(){
    Solution sol;
    vector<int> h={0,1,0,2,1,0,1,3,2,1,2,1};
    int res=sol.trap(h);
    cout<<res;
}
```
# 2026.1.29
[VSCode运行python报错SyntaxError: invalid syntax](https://blog.csdn.net/weixin_44721355/article/details/137674442)

## [边反转的最小路径总成本](https://leetcode.cn/problems/minimum-cost-path-with-edge-reversals/description/)
把反过来的边加入邻接表，然后Dijkstra即可。
```cpp
import heapq
class Solution:
    def minCost(self, n: int, edges: list[list[int]]) -> int:
        m=len(edges)
        g=[[] for _ in range(n)]
        for i in range(m):
            x,y,w=edges[i][0],edges[i][1],edges[i][2]
            g[x].append((y,w))
            g[y].append((x,2*w))
        dist=[float('inf')]*n
        vis=[False]*n
        dist[0]=0
        h=[(0,0)]
        while h:
            cur,d=heapq.heappop(h)
            if(d>dist[cur]):
                continue
            for v,w in g[cur]:
                new_dist=w+d
                if(new_dist<dist[v]):
                    dist[v]=new_dist
                    heapq.heappush(h,(v,new_dist)) 
        return dist[n-1] if dist[n-1]!=float("inf") else -1
print(Solution().minCost(4,[[0,1,3],[3,1,1],[2,3,4],[0,2,2]]))
```
## [找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/description/?envType=study-plan-v2&envId=top-100-liked)
滑动窗口。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> findAnagrams(string s, string p) {
        vector<int> res;
        vector<int> a(26);
        vector<int> b(26);
        int n=s.length();
        int m=p.length();
        if(n<m){
            return res;
        }
        for(int i=0;i<m;i++){
            a[s[i]-'a']++;
            b[p[i]-'a']++;
        }
        if(a==b){
            res.push_back(0);
        }
        for(int i=0;i<n-m;i++){
            a[s[i]-'a']--;
            a[s[i+m]-'a']++;
            if(a==b){
                res.push_back(i+1);
            }
        }
        return res;
    }
};
int main(){
    string s="aa";
    string p="bb";
    Solution sol;
    vector<int> t=sol.findAnagrams(s,p);
    for(int i=0;i<t.size();i++){
        cout<<t[i]<<" ";
    }
    return 0; 
}
```
# 2026.2.10
## [和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/description/?envType=study-plan-v2&envId=top-100-liked)
当遍历到第i个数时，累加之前的所有前缀和中等于pre[i]-k的前缀和的个数。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        unordered_map<int,int> mp;
        mp[0]=1;
        int cnt=0,pre=0;
        for (int i=0;i<nums.size();i++){
            pre+=nums[i];
            if(mp.find(pre-k)!=mp.end()){//已找到
                cnt+=mp[pre-k];
            }
            mp[pre]++;
        }
        return cnt;
    }
};   
int main(){
    vector<int> nums={1,2,3};
    int k=2;
    Solution sol;
    int ans=sol.subarraySum(nums,2);
    cout<<ans<<endl;
    return 0;
}
```
# 2026.2.11
## [最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/description/?envType=study-plan-v2&envId=top-100-liked)
滑动窗口。遍历右端点，每次在符合要求的情况下缩左端点。
1.遍历哈希表：for(const auto &p : ori)，p.first,p.secnd
2.调用函数时，使用值传递会创建一次副本，占用多余内存空间，可使用引用传递（const)。
3.s.substr(l,len)，多次调用会导致超内存。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    unordered_map<char,int> m,ori;
    bool check(){
        for(const auto &p : ori){
            if(m.find(p.first) == m.end() || m[p.first]< p.second){
                return false;
            }
        }
        return true;
    }
    string minWindow(string s, string t) {
        int len=INT_MAX,ans=0;
        for(int i=0;i<t.length();i++){
            ori[t[i]]++;
        }
        int l=0;
        for(int r=0;r<s.length();r++){
            m[s[r]]++;
            while(check()&&l<=r){
                if(r-l+1<len){
                    len=r-l+1;
                    ans=l;
                }
                m[s[l]]--;
                l++;
            }
        }
        if(len==INT_MAX) return "";
        return s.substr(ans,len);
    }
};
int main(){
    Solution sol;
    string s="ADOBECODEBANC",t="ABC";
    string res=sol.minWindow(s,t);
    cout<<res<<endl;
    return 0;
}
```
## [最大子数组和](https://leetcode.cn/problems/maximum-subarray/description/?envType=study-plan-v2&envId=top-100-liked)
dp。
亦可考虑二分，用左右子区间的lsum，rsum，区间和和最小和来更新整体。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int maxm(int x,int y){
        if(x>y) return x;
        return y;
    }
    int maxSubArray(vector<int>& nums) {
        int dp[100005];
        memset(dp,INT_MIN,sizeof(dp));
        int ans=INT_MIN;
        for(int i=0;i<nums.size();i++){
            if(i==0) dp[i]=nums[i];
            else dp[i]=maxm(nums[i],dp[i-1]+nums[i]);
            ans=maxm(ans,dp[i]);
        }
        return ans;
    }
};
int main(){
    vector<int> nums={-2,1,-3,4,-1,2,1,-5,4};
    Solution sol;
    int ans=sol.maxSubArray(nums);
    cout<<ans<<endl;
    return 0;
}
```
# 2026.2.13
## [合并区间](https://leetcode.cn/problems/merge-intervals/description/?envType=study-plan-v2&envId=top-100-liked)
1.ans.push_back(t),ans.pop_back()
2.t=ans.back()
3.vector排序：
`sort(intervals.begin(),intervals.end());//默认按第一列升序`
`sort(intervals.begin(),intervals.end(),greater<int>());//降序`
```
sort(vec.begin(), vec.end(), [](const vector<int>& a, const vector<int>& b) {
    return a[0] > b[0];
});//按第一列降序
```

```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int max(int a,int b){
        if(a>b){
            return a;
        }
        return b;
    }
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        if(intervals.size()==0){
            return {};
        }
        sort(intervals.begin(),intervals.end());
        vector<vector<int>> ans;
        for(int i=0;i<intervals.size();i++){
            int l=intervals[i][0],r=intervals[i][1];
            if(ans.size()==0 or ans.back()[1]<l){
                ans.push_back(intervals[i]);
            }
            else{
                vector<int> t={ans.back()[0],max(r,ans.back()[1])};
                ans.pop_back();
                ans.push_back(t);
            }
        }
        return ans;
    }
};
int main(){
    vector<vector<int>> intervals={{1,3},{2,6},{8,10},{15,18}};
    Solution sol;
    vector<vector<int>> ans=sol.merge(intervals);
    for(int i=0;i<ans.size();i++){
        vector<int> t=ans[i];
        for(int j=0;j<t.size();j++){
            cout<<t[j]<<" ";
        }
        cout<<endl;
    }
}
```
## [轮转数组](https://leetcode.cn/problems/rotate-array/description/?envType=study-plan-v2&envId=top-100-liked)
![image](https://img2024.cnblogs.com/blog/2669443/202602/2669443-20260213182925499-10269711.png)
翻转一步步交换头和尾然后往里缩即可。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    void reverse(vector<int>& nums,int start,int end){
        while(start<end){
            swap(nums[start],nums[end]);
            start++;
            end--;
        }
    }
    void rotate(vector<int>& nums, int k) {
        int n=nums.size();
        k%=n;
        reverse(nums,0,n-1);
        reverse(nums,0,k-1);
        reverse(nums,k,n-1);
    }
};
int main(){
    Solution sol;
    vector<int> nums={1,2,3,4,5,6,7};
    int k=3;
    sol.rotate(nums,k);
    return 0;
}
``
## [除了自身以外数组的乘积](https://leetcode.cn/problems/product-of-array-except-self/description/?envType=study-plan-v2&envId=top-100-liked)
前缀后缀。
vector<int> ans(n);
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n=nums.size();
        vector<int> l(n),r(n);
        l[0]=r[0]=1;
        for(int i=1;i<n;i++){
            l[i]=l[i-1]*nums[i-1];
            r[i]=r[i-1]*nums[n-i];
        }
        vector<int> ans;
        for(int i=0;i<n;i++){
            ans.push_back(l[i]*r[n-i-1]);
        }
        return ans;
    }
};
int main(){
    Solution sol;
    vector<int> nums={1,2,3,4};
    vector<int> ans=sol.productExceptSelf(nums);
    for(int i=0;i<ans.size();i++){
        cout<<ans[i]<<" ";
    }
}
```
# 2026.2.16
## [缺失的第一个正数](https://leetcode.cn/problems/first-missing-positive/description/?envType=study-plan-v2&envId=top-100-liked)
手搓哈希表。先把数组中所有数变为正整数，再用负数标记以目标数-1为下标的数。遍历一遍第一个正数对应的下标+1即为答案。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        int n=nums.size();
        for(int i=0;i<n;i++){
            if(nums[i]<=0) nums[i]=n+1;
        }
        for(int i=0;i<n;i++){
            if(abs(nums[i])<=n){
                nums[abs(nums[i])-1]=-abs(nums[abs(nums[i])-1]);
            }
        }
        for(int i=0;i<n;i++){
            if(nums[i]>0) return i+1;
        }
        return n+1;
    }
};
int main(){
    vector<int> nums={1,2,0};
    Solution sol;
    int ans=sol.firstMissingPositive(nums);
    cout<<ans<<endl;
    return 0;
}
```
## [矩阵置零](https://leetcode.cn/problems/set-matrix-zeroes/description/?envType=study-plan-v2&envId=top-100-liked)
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m=matrix.size();
        int n=matrix[0].size();
        int row[m+1],col[n+1];
        memset(row,1,sizeof(row));
        memset(col,1,sizeof(col));
        for(int i=0;i<m;i++){
            for(int j=0;j<n;j++){
                if(matrix[i][j]==0){
                    row[i]=0;
                    col[j]=0;
                }
            }
        }
        for(int i=0;i<m;i++){
            if(row[i]==0){
                for(int j=0;j<n;j++){
                    matrix[i][j]=0;
                }
            }
        }
        for(int i=0;i<n;i++){
            if(col[i]==0){
                for(int j=0;j<m;j++){
                    matrix[j][i]=0;
                }
            }
        }
    }
};
int main(){
    vector<vector<int>> matrix={{0,1,2,0},{3,4,5,2},{1,3,1,5}};
    Solution sol;
    sol.setZeroes(matrix);
    for(int i=0;i<matrix.size();i++){
        for(int j=0;j<matrix[0].size();j++){
            cout<<matrix[i][j]<<" ";
        }
        cout<<endl;
    }
    return 0;
}
```
## [螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/description/?envType=study-plan-v2&envId=top-100-liked)
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        int dx[4]={0,1,0,-1};
        int dy[4]={1,0,-1,0};
        int dir=0,xx=0,yy=0;
        int m=matrix.size();
        int n=matrix[0].size();
        vector<int> ans;
        for(int i=1;i<=m*n;i++){
            ans.push_back(matrix[xx][yy]);
            matrix[xx][yy]=101;
            xx+=dx[dir];
            yy+=dy[dir];
            if(xx<0||xx>=m||yy<0||yy>=n||matrix[xx][yy]==101){
                xx-=dx[dir];
                yy-=dy[dir];
                dir=(dir+1)%4;
                xx+=dx[dir];
                yy+=dy[dir];
            }
        }
        return ans;
    }
};
int main(){
    vector<vector<int>> matrix={{1,2,3},{4,5,6},{7,8,9}};
    Solution sol;
    vector<int> ans=sol.spiralOrder(matrix);
    for(int i=0;i<ans.size();i++){
        cout<<ans[i]<<" ";    
    }
    return 0;
}
```
# 2026.2.17
新年快乐😋
## [旋转图像](https://leetcode.cn/problems/rotate-image/description/?envType=study-plan-v2&envId=top-100-liked)
第i行j列变成了倒数第j列第i行，因此先上下翻转再沿主对角线翻转即可。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n=matrix.size();
        for(int k=0;k<n;k++){
            int i=0,j=n-1;
            while(i<j){
                swap(matrix[i][k],matrix[j][k]);
                i++;
                j--;
            }
        }
        for(int i=0;i<n;i++){
            for(int j=i+1;j<n;j++){
                swap(matrix[i][j],matrix[j][i]);
            }
        }
    }
};
int main(){
    vector<vector<int>> matrix={{1,2,3},{4,5,6},{7,8,9}};
    Solution sol;
    sol.rotate(matrix);
    for(int i=0;i<matrix.size();i++){
        for(int j=0;j<matrix[0].size();j++){
            cout<<matrix[i][j]<<" ";
        }
        cout<<endl;
    }
    return 0;
}
```
# 2026.2.20
## [搜索二维矩阵 II](https://leetcode.cn/problems/search-a-2d-matrix-ii/description/?envType=study-plan-v2&envId=top-100-liked)
C++不能连续比较（表达式有值）。
从右上开始搜，如果更大往下移，如果更小往左移，整行/整列一定能被排除。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m=matrix.size();
        int n=matrix[0].size();
        int x=0,y=n-1;
        while(x<m && y>=0){
            int t=matrix[x][y];
            if(t==target) return true;
            else if(t>target) y--;
            else x++;
        }
        return false;
    }
};
int main(){
    vector<vector<int>> matrix={{1,4,7,11,15},{2,5,8,12,19},{3,6,9,16,22},{10,13,14,17,24},{18,21,23,26,30}};
    Solution sol;
    int target=5;
    bool ans=sol.searchMatrix(matrix,target);
    cout<<ans<<endl;
    return 0;
}
```
## [腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/description/?envType=study-plan-v2&envId=top-100-liked)
多源bfs。
`queue<tuple<int,int,int>>`
`pair<int,int>`
`q.push()` `q.pop()` `q.front()`
`auto [x,y,z]=q.front()`
`q.front().first` `q.front().second`仅限于pair类型
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        int dx[4]={0,1,0,-1};
        int dy[4]={1,0,-1,0};
        queue<tuple<int,int,int>> q;
        int m=grid.size();
        int n=grid[0].size();
        int vis[m+1][n+1];
        memset(vis,0,sizeof(vis));
        for(int i=0;i<m;i++){
            for(int j=0;j<n;j++){
                if(grid[i][j]==2){
                    q.push({i,j,0});
                    vis[i][j]=1;
                }
            }
        }
        int ans=0;
        while(!q.empty()){
            auto [x,y,time]=q.front();
            q.pop();
            ans=time;
            for(int i=0;i<4;i++){
                int xx=x+dx[i],yy=y+dy[i];
                if(xx>=0 &&xx<m && yy>=0 && yy<n && grid[xx][yy]==1 && vis[xx][yy]==0){
                    grid[xx][yy]=2;
                    vis[xx][yy]=1;
                    q.push({xx,yy,time+1});
                }
            }
        }
        for(int i=0;i<m;i++){
            for(int j=0;j<n;j++){
                if(grid[i][j]==1) return -1;
            }
        }
        return ans;
    }
};
int main(){
    vector<vector<int>> grid={{2,1,1},{1,1,0},{0,1,1}};
    Solution sol;
    int ans=sol.orangesRotting(grid);
    cout<<ans<<endl;
    return 0;
}
```
# 2026.2.21
## [课程表](https://leetcode.cn/problems/course-schedule/description/?envType=study-plan-v2&envId=top-100-liked)
拓扑排序。即判断是否为DAG。将每个入度为0的点加入队列，并bfs。判断是否所有点都入队即可。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> edges(numCourses);
        int indeg[numCourses];
        memset(indeg,0,sizeof(indeg));
        for(int i=0;i<prerequisites.size();i++){
            int x=prerequisites[i][0],y=prerequisites[i][1];
            edges[y].push_back(x);
            indeg[x]++;
        }
        queue<int> q;
        for(int i=0;i<numCourses;i++){
            if(indeg[i]==0) q.push(i);
        }
        int cnt=0;
        while(!q.empty()){
            cnt++;
            int t=q.front();
            q.pop();
            for(int i=0;i<edges[t].size();i++){
                indeg[edges[t][i]]--;
                if(indeg[edges[t][i]]==0) q.push(edges[t][i]);
            }
        }
        return cnt==numCourses;
    }
};
int main(){
    int numCourses=2;
    vector<vector<int>> prerequisites={{1,0}};
    Solution sol;
    bool ans=sol.canFinish(numCourses,prerequisites);
    cout<<ans<<endl;
    return 0;
}
```
## [实现 Trie (前缀树)](https://leetcode.cn/problems/implement-trie-prefix-tree/description/?envType=study-plan-v2&envId=top-100-liked)
1.private仅限于类内部访问，数据成员通常设为private；提供public方法来访问和修改数据。
2.类名 Trie：定义了一种新的数据类型；
构造函数 Trie()：创建该类对象时自动调用的特殊函数，必须与类名相同；
Trie*：指向 Trie 类型对象的指针；
next[26]：存储这些指针的数组。
![image](https://img2024.cnblogs.com/blog/2669443/202602/2669443-20260221163236148-1492203635.png)
简化后空链接后
![image](https://img2024.cnblogs.com/blog/2669443/202602/2669443-20260221163251942-1467354018.png)
3.this 是指向当前对象的指针，在这里，this 指向调用 insert 函数的 Trie 对象（通常是根节点）。
4.`for (char c : word)`是 C++11 引入的基于范围的 for 循环。
`for (元素类型 变量名 : 容器/数组)`
5.
```cpp
    // ========== 方式1：使用对象（栈上分配） ==========
    Trie obj1;              // 直接创建对象
    obj1.insert("apple");   // 使用 . 运算符
    obj1.search("apple");   // 使用 . 运算符
    
    // ========== 方式2：使用对象指针（堆上分配） ==========
    Trie* obj2 = new Trie(); // new 返回指针
    obj2->insert("banana");  // 使用 -> 运算符
    obj2->search("banana");  // 使用 -> 运算符

// new 运算符的作用：
Trie* obj = new Trie();  
// 1. 在堆(heap)上分配内存
// 2. 调用构造函数初始化
// 3. 返回这块内存的地址（指针）

// 堆内存需要手动管理
delete obj;  // 释放内存

// 对比栈分配：
Trie obj;  // 在栈(stack)上分配，自动管理生命周期
// 函数结束时自动销毁
```

```cpp
#include<bits/stdc++.h>
using namespace std;
class Trie {
private:
    bool isEnd;
    Trie* next[26];
public:
    Trie() {
        isEnd=false;
        memset(next,0,sizeof(next));
    }
    
    void insert(string word) {
        Trie* node=this;//root
        for(char c:word){
            if(node->next[c-'a']==NULL){
                node->next[c-'a']=new Trie;
            }
            node=node->next[c-'a'];
        }
        node->isEnd=true;
    }
    
    bool search(string word) {
        Trie* node=this;
        for(char c:word){
            node=node->next[c-'a'];
            if(node==NULL){
                return false;
            }
        }
        return node->isEnd;
    }
    
    bool startsWith(string prefix) {
        Trie* node=this;
        for(char c:prefix){
            node=node->next[c-'a'];
            if(node==NULL){
                return false;
            }
        }
        return true;
    }
};

/**
 * Your Trie object will be instantiated and called as such:
 * Trie* obj = new Trie();
 * obj->insert(word);
 * bool param_2 = obj->search(word);
 * bool param_3 = obj->startsWith(prefix);
 */
int main(){
    Trie* obj=new Trie();
    obj->insert("apple");
    bool param_2=obj->search("apple");
    bool param_3=obj->startsWith("app");
    cout<<param_2<<" "<<param_3<<endl;
    return 0;
}
```
## [搜索二维矩阵](https://leetcode.cn/problems/search-a-2d-matrix/description/?envType=study-plan-v2&envId=top-100-liked)
被copilot搓的数据坑了。
1.upper_bound 返回第一个大于给定值的元素的迭代器.
`auto it = upper_bound(vec.begin(), vec.end(), 30);`
判断it是否为vec.end()
不是,则目标元素为 * it，目标位置为it-vec.begin()
lower_bound():大于等于
2.
```cpp
auto row = upper_bound(matrix.begin(), matrix.end(), target, [](const int b, const vector<int> &a) {
            return b < a[0];
        });
```
自定义target和行首元素比较。
row的类型为vector<vector<int>>::iterator，指向某一行的vector<int>。
row的前一行为 `prev(row)` ，后一行为 `next(row)`

3.`bool found = binary_search(nums.begin(), nums.end(), 7);`
`binary_search()函数返回布尔值，表示目标是否在有序数组中存在。`

```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m=matrix.size(),n=matrix[0].size();
        auto row=upper_bound(matrix.begin(),matrix.end(),target,[](const int b,const vector<int>& a){
            return b<a[0];
        });
        if(row==matrix.begin()){
            return false;
        }
        row=prev(row);
        return binary_search(row->begin(),row->end(),target);
    }
};
int main(){
    vector<vector<int>> matrix={{1,3,5,7},{10,11,16,20},{23,30,34,60}};
    int target=3;
    Solution sol;
    bool ans=sol.searchMatrix(matrix,target);
    cout<<ans<<endl;
    return 0;
}
```
## [在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/description/?envType=study-plan-v2&envId=top-100-liked)
显式类型转换`static_cast<int>`
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        auto l=lower_bound(nums.begin(),nums.end(),target);
        auto r=upper_bound(nums.begin(),nums.end(),target);
        if(l==nums.end()||(l==r && *l!=target)) return {-1,-1};
        return {static_cast<int>(l-nums.begin()), static_cast<int>(r-nums.begin()-1)};
    }
};
int main(){
    vector<int> nums={1};
    int target=1;
    Solution sol;
    vector<int> ans=sol.searchRange(nums,target);
    for(int i:ans){
        cout<<i<<" ";
    }
    cout<<endl;
    return 0;
}
```
## [搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/description/?envType=study-plan-v2&envId=top-100-liked)
直接二分。二分后一定有半段是有序的，如果不在这半段里那么对另一端继续二分。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int n=nums.size();
        int l=0,r=n-1;
        while(l<=r){
            int mid=(l+r)>>1;
            if(nums[mid]==target) return mid;
            if(nums[0]<=nums[mid]){
                if(nums[0]<=target && target<=nums[mid]) r=mid-1;
                else l=mid+1;
            }
            else{
                if(nums[mid]<=target && target<=nums[r]) l=mid+1;
                else r=mid-1;
            }
        }
        return -1;
    }
};
int main(){
    vector<int> nums={4,5,6,7,0,1,2};
    int target=0;
    Solution sol;
    int ans=sol.search(nums,target);
    cout<<ans<<endl;
    return 0;
}
```
# 2026.2.23
## [寻找旋转排序数组中的最小值](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/description/?envType=study-plan-v2&envId=top-100-liked)
mid与最右边的数比较。mid小于最右边的数则最小值在mid左边，或最小值为mid。mid大于最右边的数则最小值在mid右边。注意收缩边界的情况，当最小值为mid时不要把最小值排出去了。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int findMin(vector<int>& nums) {
        int n=nums.size();
        int l=0,r=n-1;
        while(l<r){
            int mid=(l+r)>>1;
            if(nums[mid]>nums[r]) l=mid+1;
            else r=mid;
        }
        return nums[l];
    }
};
int main(){
    vector<int> nums={3,4,5,1,2};
    Solution sol;
    int ans=sol.findMin(nums);
    cout<<ans<<endl;
    return 0;
}
```
## [寻找两个正序数组的中位数](https://leetcode.cn/problems/median-of-two-sorted-arrays/description/?envType=study-plan-v2&envId=top-100-liked)
找第k个数的思路：两个数组各取k/2，第k/2个数中较小的及其之前的都可以排除，指针后移。然后k更新为k/2（即找未排除的数中的第k_new个），继续两边对比，移动指针，直到边界情况：一个数组清空或k=1为止。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int doit(const vector<int>& nums1,const vector<int>& nums2,int k){
        int m=nums1.size(),n=nums2.size();
        int id1=0,id2=0;
        while(k){
            if(id1==m) return nums2[id2+k-1];
            if(id2==n) return nums1[id1+k-1];
            if(k==1) return min(nums1[id1],nums2[id2]);
            int idx=min(id1+k/2-1,m-1),idy=min(id2+k/2-1,n-1);
            if(nums1[idx]<nums2[idy]){
                k-=(idx-id1+1);
                id1=idx+1;
            }
            else{
                k-=(idy-id2+1);
                id2=idy+1;
            }
        }
        return -1;
    }
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        int m=nums1.size(),n=nums2.size();
        if((m+n)%2==1) return doit(nums1,nums2,(m+n+1)/2);
        else return static_cast<double>((doit(nums1,nums2,(m+n)/2)+doit(nums1,nums2,(m+n)/2+1))/2.0);
    }
};
int main(){
    vector<int> nums1={1,3};
    vector<int> nums2={2};
    Solution sol;
    double ans=sol.findMedianSortedArrays(nums1,nums2);
    cout<<ans<<endl;
    return 0;
}
```
# 2026.2.24
## [最小栈](https://leetcode.cn/problems/min-stack/description/?envType=study-plan-v2&envId=top-100-liked)
```cpp
#include<bits/stdc++.h>
using namespace std;
class MinStack {
private:
    stack<int> s;
    stack<int> mins;
public:
    MinStack() {
        mins.push(INT_MAX);
    }
    
    void push(int val) {
        int t=mins.top();
        s.push(val);
        mins.push(min(val,t));
    }
    
    void pop() {
        s.pop();
        mins.pop();
    }
    
    int top() {
        return s.top();
    }
    
    int getMin() {
        return mins.top();
    }
};

/**
 * Your MinStack object will be instantiated and called as such:
 * MinStack* obj = new MinStack();
 * obj->push(val);
 * obj->pop();
 * int param_3 = obj->top();
 * int param_4 = obj->getMin();
 */
int main(){
    MinStack* obj=new MinStack();
    obj->push(-2);
    obj->push(0);
    obj->push(-3);
    int t1=obj->getMin();
    obj->pop();
    int t2=obj->top();
    int t3=obj->getMin();
    cout<<t1<<" "<<t2<<" "<<t3<<endl;
    return 0;
}
```
## [字符串解码](https://leetcode.cn/problems/decode-string/description/?envType=study-plan-v2&envId=top-100-liked)
stoi():string转int
isdigit():判断char类型为数字
reverse(t.begin(),t.end())：字符串翻转
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    string decodeString(string s) {
        stack<string> a;
        for(int i=0;i<s.length();i++){
            char c=s[i];
            string t="";
            if(c>='0' and c<='9'){
                if(i==0 || !isdigit(s[i-1])){
                    t+=c;
                    a.push(t);
                }
                else{
                    string qaq=a.top();
                    a.pop();
                    a.push(qaq+c);
                }
            }
            else if(c==']'){
                while(a.top()!="["){
                    t=a.top()+t;
                    a.pop();
                }
                a.pop();
                int d=stoi(a.top());
                a.pop();
                string temp=t;
                for(int i=1;i<=d-1;i++){
                    t+=temp;
                }
                a.push(t);
            }
            else{
                t+=c;
                a.push(t);
            }
        }
        string ans="";
        while(!a.empty()){
            ans=a.top()+ans;
            a.pop();
        }
        return ans;
    }
};
int main(){
    string s="abc3[cd]xyz";
    Solution sol;
    string ans=sol.decodeString(s);
    cout<<ans<<endl;
    return 0;
}
```
## [每日温度](https://leetcode.cn/problems/daily-temperatures/description/?envType=study-plan-v2&envId=top-100-liked)
单调栈。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        stack<int> s;
        int n=temperatures.size();
        vector<int> ans;
        for(int i=0;i<n;i++){
            ans.push_back(0);
        }
        for(int i=0;i<n;i++){
            while(!s.empty() && temperatures[s.top()]<temperatures[i]){
                ans[s.top()]=i-s.top();
                s.pop();
            }
            s.push(i);
        }
        return ans;
    }
};
int main(){
    vector<int> temperatures={73,74,75,71,69,72,76,73};
    Solution sol;
    vector<int> ans=sol.dailyTemperatures(temperatures);
    for(int i:ans){
        cout<<i<<" ";
    }
    return 0;
}
```
## [数组中的第K个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/description/?envType=study-plan-v2&envId=top-100-liked)
快速选择。随机选择pivot，比它大和小的放两边，然后根据k判断目标在哪个数组里面，再递归。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int quickselect(vector<int>& nums,int k){
        int n=nums.size();
        int pivot=nums[rand()%n];
        vector<int> big,equal,small;
        for(int num:nums){
            if(num>pivot) big.push_back(num);
            else if(num<pivot) small.push_back(num);
            else equal.push_back(num);
        }
        if(k<=big.size()) return quickselect(big,k);
        if(nums.size()-small.size()<k) return quickselect(small,k-(nums.size()-small.size()));
        return pivot;
    }
    int findKthLargest(vector<int>& nums, int k) {
        return quickselect(nums,k);
    }
};
int main(){
    vector<int> nums={3,2,1,5,6,4};
    Solution sol;
    int k=2;
    int ans=sol.findKthLargest(nums,k);
    cout<<ans<<endl;
    return 0;
}
```
## [前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/description/?envType=study-plan-v2&envId=top-100-liked)
哈希表+桶排。
.insert()
![image](https://img2024.cnblogs.com/blog/2669443/202602/2669443-20260224154326507-2138733525.png)
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int,int> cnt;
        int n=0;
        for(int x:nums){
            cnt[x]++;
            n=max(n,cnt[x]);
        }
        vector<vector<int>> bucket(n+1);
        for(auto& [x,c]:cnt){
            bucket[c].push_back(x);
        }
        vector<int> ans;
        for(int i=n;i>=0 && ans.size()<k;i--){
            ans.insert(ans.end(),bucket[i].begin(),bucket[i].end());
        }
        return ans;
    }
};
int main(){
    vector<int> nums={1,1,1,2,2,3};
    int k=2;
    Solution sol;
    vector<int> ans=sol.topKFrequent(nums,k);
    for(int i:ans){
        cout<<i<<" ";
    }
    return 0;
}
```
## [数据流的中位数](https://leetcode.cn/problems/find-median-from-data-stream/description/?envType=study-plan-v2&envId=top-100-liked)
双堆。大根堆维护小于等于中位数的数，小根堆维护大于中位数的数。如果加入之后不平衡就把堆顶移到另一边。求中位数时取堆顶即可。
```cpp
#include<bits/stdc++.h>
using namespace std;
class MedianFinder {
private:
    priority_queue<int,vector<int>,less<int>> queMin;//大根堆,<=median
    priority_queue<int,vector<int>,greater<int>> queMax;//小根堆,>median
public:
    MedianFinder() {
        
    }
    
    void addNum(int num) {
        if(queMin.empty() || num<queMin.top()){
            queMin.push(num);
            if(queMax.size()+1<queMin.size()){
                queMax.push(queMin.top());
                queMin.pop();
            }
        }
        else{
            queMax.push(num);
            if(queMax.size()>queMin.size()){
                queMin.push(queMax.top());
                queMax.pop();
            }
        }
    }
    
    double findMedian() {
        if(queMin.size()>queMax.size()) return queMin.top();
        else return (queMin.top()+queMax.top())/2.0;
    }
};

/**
 * Your MedianFinder object will be instantiated and called as such:
 * MedianFinder* obj = new MedianFinder();
 * obj->addNum(num);
 * double param_2 = obj->findMedian();
 */
int main(){
    MedianFinder* obj=new MedianFinder();
    obj->addNum(1);
    obj->addNum(2);
    double ans1=obj->findMedian();
    obj->addNum(3);
    double ans2=obj->findMedian();
    cout<<ans1<<" "<<ans2<<endl;
    return 0;
}
```
## [当前队列中位数](http://cs101.openjudge.cn/pctbook/T27256/)
上学期没敢写的一道题目，终于写掉了。
双堆+懒删除，懒删除的关键在于清除堆顶已删除元素与平衡双堆。平衡根据两堆的实际大小来，而不是堆的size，因此额外开变量记录。先clear，平衡完再clear，由于按照实际大小来，两堆一定平衡。
1.如果用宏定义#define int long long,需要将int main()改为signed main().
2.![image](https://img2024.cnblogs.com/blog/2669443/202602/2669443-20260224210710081-895303480.png)
超时可以加
```cpp
ios::sync_with_stdio(0);
cin.tie(0);
cout.tie(0);
```
或者使用scanf，printf.
```cpp
#include <cstdio>
int main() {
    int a;
    long long b;
    double c;
    char s[100];

    // 输入：123 4567890123 3.14 hello
    scanf("%d %lld %lf %s", &a, &b, &c, s);

    // 输出
    printf("a = %d\n", a);
    printf("b = %lld\n", b);
    printf("c = %.2f\n", c);      // 保留两位小数
    printf("s = %s\n", s);

    return 0;
}
```
scanf注意加取地址符，数组会隐式转换为指向第一个元素的指针，因此不用。
3.超时可以考虑把string换成char[]
4.`.reserve(n)`给stl分配内存空间，提升性能。
![image](https://img2024.cnblogs.com/blog/2669443/202602/2669443-20260224211309371-635877104.png)
![image](https://img2024.cnblogs.com/blog/2669443/202602/2669443-20260224211320986-1457472408.png)
copilot巧设连环计，cpp误入断头台。全靠Gemini3.0救回来。
```cpp
#include<bits/stdc++.h>
using namespace std;
priority_queue<int> queMin;//大根堆,<=median
priority_queue<int,vector<int>,greater<int>> queMax;//小根堆,>median
unordered_map<int,int> tag;
queue<int> q;
int szmin=0,szmax=0;
void clear() {
    while (!queMin.empty() && tag[queMin.top()] > 0) {
        tag[queMin.top()]--;
        queMin.pop();
    }
    while (!queMax.empty() && tag[queMax.top()] > 0) {
        tag[queMax.top()]--;
        queMax.pop();
    }
}
void balance(){
    clear();
    while(!queMin.empty() && szmin>szmax+1){
        queMax.push(queMin.top());
        queMin.pop();
        szmin--;
        szmax++;
    }
    while(!queMax.empty() && szmax>szmin){
        queMin.push(queMax.top());
        queMax.pop();
        szmax--;
        szmin++;
    }
    clear();
}
void addNum(int num) {
    q.push(num);
    if(queMin.empty() || num<=queMin.top()){
        queMin.push(num);
        szmin++;
    }
    else{
        queMax.push(num);
        szmax++;
    }
    balance();
}
void delNum(){
    int target=q.front();
    q.pop();
    clear();
    if(!queMin.empty() && target<=queMin.top()) szmin--;
    else szmax--;
    tag[target]++;
    balance();
}
void findMedian() {
    clear();
    if(szmin>szmax) printf("%d\n", queMin.top());
    else{
        int sum=queMin.top()+queMax.top();
        if(sum%2==0) printf("%d\n", sum / 2);
        else{
            double ans=sum/2.0;
            printf("%.1f\n", ans);
        }
    }
}
int main() {
    int n;
    if (scanf("%d", &n) == EOF) return 0;

    // 预留空间减少 unordered_map 扩容开销，防止超时
    tag.reserve(n);

    while (n--) {
        char op[10];
        scanf("%s", op);
        if (op[0] == 'a') {
            int num;
            scanf("%d", &num);
            addNum(num);
        } else if (op[0] == 'd') {
            delNum();
        } else if (op[0] == 'q') {
            findMedian();
        }
    }
    return 0;
}
```
## [跳跃游戏](https://leetcode.cn/problems/jump-game/description/?envType=study-plan-v2&envId=top-100-liked)
能到l就代表能到l之前的所有点。根据能到的每个点更新能到的最远距离即可。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool canJump(vector<int>& nums) {
        int l=0;
        int n=nums.size();
        for(int i=0;i<n;i++){
            if(l<i) continue;
            l=max(l,i+nums[i]);
        }
        if(l>=n-1) return true;
        return false;
    }
};
int main(){
    vector<int> nums={2,3,1,1,4};
    Solution sol;
    bool ans=sol.canJump(nums);
    cout<<ans<<endl;
    return 0;
}
```
#2026.2.25
## [跳跃游戏 II](https://leetcode.cn/problems/jump-game-ii/description/?envType=study-plan-v2&envId=top-100-liked)
选择当前位置一直到上一次设定的边界中能够跳得最远的值作为新的边界。碰到边界就代表要加一步。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int jump(vector<int>& nums) {
        int ans=0;
        int n=nums.size();
        int maxm=0,end=0;
        for(int i=0;i<n-1;i++){
            maxm=max(maxm,nums[i]+i);
            if(i==end) {
                ans++;
                end=maxm;
            }
        }
        return ans;
    }
};   
int main(){
    vector<int> nums={2,3,1,1,4};
    Solution sol;
    int ans=sol.jump(nums);
    cout<<ans<<endl;
    return 0;
}
```
## [划分字母区间](https://leetcode.cn/problems/partition-labels/description/?envType=study-plan-v2&envId=top-100-liked)
区间合并。
![image](https://img2024.cnblogs.com/blog/2669443/202602/2669443-20260225150135820-674493928.png)
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> partitionLabels(string s) {
        unordered_map<char,int> a,b;
        int m=s.length();
        for(int i=0;i<m;i++){
            char c=s[i];
            if(a.find(c)==a.end()){
                a[c]=i;
                b[c]=i;
            }
            else b[c]=i;
        }
        int n=a.size();
        vector<pair<int,int>> intervals;
        for(auto p:a){
            intervals.push_back(make_pair(p.second,b[p.first]));
        }
        sort(intervals.begin(),intervals.end());
        vector<int> ans;
        int start=0,end=0;
        for(int i=0;i<intervals.size();i++){
            auto [x,y]=intervals[i];
            if(x>end){
                ans.push_back(end-start+1);
                start=x;
            }
            end=max(end,y);
        }
        ans.push_back(end-start+1);
        return ans;
    }
};
int main(){
    string s="eaaaabaaec";
    Solution sol;
    vector<int> ans=sol.partitionLabels(s);
    for(int i:ans) cout<<i<<" ";
    cout<<endl;
    return 0;
}
```
## [零钱兑换](https://leetcode.cn/problems/coin-change/description/?envType=study-plan-v2&envId=top-100-liked)
**只有 0 和 -1 可以用 memset 正确设置整数数组**
`fill(dp,dp+n,INT_MAX);`
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        int dp[amount+1];
        fill(dp,dp+amount+1,INT_MAX);
        dp[0]=0;
        for(int i=1;i<=amount;i++){
            for(int j:coins){
                if(i>=j&&dp[i-j]!=INT_MAX){
                    dp[i]=min(dp[i-j]+1,dp[i]);
                }
            }
        }
        if(dp[amount]==INT_MAX) return -1;
        return dp[amount];
    }
};
int main(){
    vector<int> coins={1,2,5};
    int amount=11;
    Solution sol;
    int ans=sol.coinChange(coins,amount);
    cout<<ans<<endl;
    return 0;
}
```
## [最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/description/?envType=study-plan-v2&envId=top-100-liked)
贪心+二分。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> s;
        for(int i:nums){
            if(s.empty()||s.back()<i) s.push_back(i);
            else{
                auto it=lower_bound(s.begin(),s.end(),i);
                s[it-s.begin()]=i;
            }
        }
        return s.size();
    }
};
int main(){
    vector<int> nums={7,7,7,7,7,7,7};
    Solution sol;
    int ans=sol.lengthOfLIS(nums);
    cout<<ans<<endl;
    return 0;
}
```
## [分割等和子集](https://leetcode.cn/problems/partition-equal-subset-sum/description/?envType=study-plan-v2&envId=top-100-liked)
0-1背包.
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int n=nums.size();
        if(n==1) return false;
        int sum=0,maxm=0;
        for(int i:nums){
            sum+=i;
            maxm=max(maxm,i);
        }
        if(sum%2==1) return false;
        if(maxm>sum/2) return false;
        int target=sum/2;
        bool dp[target+1];
        memset(dp,0,sizeof(dp));
        dp[nums[0]]=1;
        for(int i=1;i<n;i++){
            int num=nums[i];
            for(int j=target;j>=num;j--){
                dp[j]|=dp[j-num];
            }
        }
        return dp[target];
    }
};
int main(){
    vector<int> nums={1,5,11,5};
    Solution sol;
    bool ans=sol.canPartition(nums);
    cout<<ans<<endl;
    return 0;
}
```
## [最长有效括号](https://leetcode.cn/problems/longest-valid-parentheses/description/?envType=study-plan-v2&envId=top-100-liked)
栈。栈底放置上一个未匹配的右括号的编号。如果是左括号则下标进栈。如果是右括号弹出栈顶，能匹配则当前下标减去当前栈顶为一段合法长度。如果匹配不了则当前右括号进栈。
亦可dp，根据前一个括号的情况递推。
亦可从前往后从后往前各扫一遍。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int longestValidParentheses(string s) {
        stack<int> st;
        st.push(-1);
        int n=s.length();
        int ans=0;
        for(int i=0;i<n;i++){
            if(s[i]=='('){
                st.push(i);
            }
            else{
                int t=st.top();
                st.pop();
                if(t==-1||s[t]==')'){
                    st.push(i);
                }
                else{
                    ans=max(ans,i-st.top());
                }
            }
        }
        return ans;
    }
};
int main(){
    string s="(()";
    Solution sol;
    int ans=sol.longestValidParentheses(s);
    cout<<ans<<endl;
    return 0;
}
```
## [不同路径](https://leetcode.cn/problems/unique-paths/description/?envType=study-plan-v2&envId=top-100-liked)
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int uniquePaths(int m, int n) {
        int dp[m][n];
        dp[0][0]=1;
        for(int i=1;i<n;i++){
            dp[0][i]=1;
        }
        for(int i=1;i<m;i++){
            dp[i][0]=1;
        }
        for(int i=1;i<m;i++){
            for(int j=1;j<n;j++){
                dp[i][j]=dp[i-1][j]+dp[i][j-1];
            }
        }
        return dp[m-1][n-1];
    }
};
int main(){
    int m=3,n=7;
    Solution sol;
    int ans=sol.uniquePaths(m,n);
    cout<<ans<<endl;
    return 0;
}
```
## [最小路径和](https://leetcode.cn/problems/minimum-path-sum/description/?envType=study-plan-v2&envId=top-100-liked)
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        int m=grid.size(),n=grid[0].size();
        int dp[m][n];
        dp[0][0]=grid[0][0];
        for(int i=1;i<m;i++){
            dp[i][0]=dp[i-1][0]+grid[i][0];
        }
        for(int i=1;i<n;i++){
            dp[0][i]=dp[0][i-1]+grid[0][i];
        }
        for(int i=1;i<m;i++){
            for(int j=1;j<n;j++){
                dp[i][j]=min(dp[i-1][j],dp[i][j-1])+grid[i][j];
            }
        }
        return dp[m-1][n-1];
    }
};
int main(){
    vector<vector<int>> grid={{1,3,1},{1,5,1},{4,2,1}};
    Solution sol;
    int ans=sol.minPathSum(grid);
    cout<<ans<<endl;
    return 0;
}
```
## [最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/description/?envType=study-plan-v2&envId=top-100-liked)
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int m=text1.length(),n=text2.length();
        int dp[m+1][n+1];
        memset(dp,0,sizeof(dp));
        for(int i=1;i<=m;i++){
            for(int j=1;j<=n;j++){
                if(text1[i-1]==text2[j-1]){
                    dp[i][j]=dp[i-1][j-1]+1;
                }
                else{
                    dp[i][j]=max(dp[i-1][j],dp[i][j-1]);
                }
            }
        }
        int maxm=0;
        for(int i=1;i<=m;i++){
            for(int j=1;j<=n;j++){
                maxm=max(dp[i][j],maxm);
            }
        }
        return maxm;
    }
};
int main(){
    string text1="abc",text2="def";
    Solution sol;
    int ans=sol.longestCommonSubsequence(text1,text2);
    cout<<ans<<endl;
    return 0;
}
```
## [只出现一次的数字](https://leetcode.cn/problems/single-number/description/?envType=study-plan-v2&envId=top-100-liked)
![image](https://img2024.cnblogs.com/blog/2669443/202602/2669443-20260225165625292-725445294.png)
所有数异或起来即可。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int res=0;
        for(int i:nums){
            res^=i;
        }
        return res;
    }
};
int main(){
    vector<int> nums={2,2,1};
    Solution sol;
    int ans=sol.singleNumber(nums);
    cout<<ans<<endl;
    return 0;
}
```
## [多数元素](https://leetcode.cn/problems/majority-element/description/?envType=study-plan-v2&envId=top-100-liked)
若干个月前的聚餐上有人提到这道题，直接取中位数即可。
`nth_element(nums.begin(),nums.begin()+k,nums.end())`
此时第k小的元素出现在nums[k]的位置，且前面的数都比它小，后面的数都比它大。
亦可哈希表。
亦可随机化。随机选一个数并判断它是不是众数。
亦可分治，其中一段的众数必定为整体的众数，一直分治到长度为1，再返回。如果判断不出来就统计个数以得出正确众数。
亦可Boyer-Moore 算法。
![image](https://img2024.cnblogs.com/blog/2669443/202602/2669443-20260225171457447-753453447.png)
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int n=nums.size();
        nth_element(nums.begin(), nums.begin() +n/2, nums.end());
        return nums[n/2];
    }
};
int main(){
    vector<int> nums={2,2,1,1,1,2,2};
    Solution sol;
    int ans=sol.majorityElement(nums);
    cout<<ans<<endl;
    return 0;
}
```
## [颜色分类](https://leetcode.cn/problems/sort-colors/description/?envType=study-plan-v2&envId=top-100-liked)
指针记录开头0的最后一位。如果扫到0就两数互换，把指针后移一位。然后1再扫一遍。
亦可计数排序。count有几个012然后填充。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    void sortColors(vector<int>& nums) {
        int idx=0,n=nums.size();
        for(int i=0;i<n;i++){
            if(nums[i]==0){
                swap(nums[i],nums[idx]);
                idx++;
            }
        }
        for(int i=idx;i<n;i++){
            if(nums[i]==1){
                swap(nums[i],nums[idx]);
                idx++;
            }
        }
    }
};
int main(){
    vector<int> nums={2,0,2,1,1,0};
    Solution sol;
    sol.sortColors(nums);
    for(int i:nums) cout<<i<<" ";
    cout<<endl;
    return 0;
}
```
## [下一个排列](https://leetcode.cn/problems/next-permutation/description/?envType=study-plan-v2&envId=top-100-liked)
手搓next_permutation.
`reverse(nums.begin()+i,nums().end);`
![image](https://img2024.cnblogs.com/blog/2669443/202602/2669443-20260225174353422-417967970.png)
`next_permutation(nums.begin(),nums.end());`
`prev_permutation(nums.begin(),nums.end());`
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        int n=nums.size();
        int idx=n;
        for(int i=n-2;i>=0;i--){
            if(nums[i]<nums[i+1]){
                idx=i;
                break;
            }
        }
        if(idx==n){
            sort(nums.begin(),nums.end());
            return;
        }
        int end=idx+1;
        for(int i=idx+1;i<n;i++){
            if(nums[idx]<nums[i]&& nums[i]<=nums[end]){
                end=i;
            }
        }
        swap(nums[idx],nums[end]);
        // int i=idx+1,j=n-1;
        // while(i<j){
        //     swap(nums[i],nums[j]);
        //     i++;
        //     j--;
        // }
        reverse(nums.begin()+idx+1,nums.end());
    }
};
int main(){
    vector<int> nums={1,2,3};
    Solution sol;
    sol.nextPermutation(nums);
    for(int i:nums) cout<<i<<" ";
    cout<<endl;
    return 0;
}
```
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        next_permutation(nums.begin(),nums.end());
    }
};
```
## [寻找重复数](https://leetcode.cn/problems/find-the-duplicate-number/description/?envType=study-plan-v2&envId=top-100-liked)
i->nums[i]建边成图。由于每个点出度为1，n+1个点有n+1条边。因此构成内向基环森林。接下来使用[Floyd 判圈算法（快慢指针）](https://leetcode.cn/problems/linked-list-cycle-ii/solutions/441131/huan-xing-lian-biao-ii-by-leetcode-solution/?envType=study-plan-v2&envId=top-100-liked)，从链表头部（0，入度为0）出发，找到快慢指针相遇的点。然后两个指针分别从头部和相遇点跑，相遇的点为入圈口。由于入度=出现次数，因此入圈口的点即为出现超过一次的点。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        int slow=0,fast=0;
        while(true){
            slow=nums[slow];
            fast=nums[nums[fast]];
            if(fast==slow){
                break;
            }
        }
        int head=0;
        while(slow!=head){
            slow=nums[slow];
            head=nums[head];
        }
        return head;
    }
};
int main(){
    vector<int> nums={1,3,4,2,2};
    Solution sol;
    int ans=sol.findDuplicate(nums);
    cout<<ans<<endl;
    return 0;
}
```
## [根据数字二进制下 1 的数目排序](https://leetcode.cn/problems/sort-integers-by-the-number-of-1-bits/description/?envType=daily-question&envId=2026-02-25)
递推生成1-n二进制1的数目：bit[n]=bit[n>>1]+(n&1);
vector自定义排序
```cpp
sort(arr.begin(),arr.end(),[&](int x,int y){
    if(bit[x]<bit[y]) return true;
    if(bit[x]>bit[y]) return false;
    return x<y;
});
sort(vec.begin(),vec.end(),[&](const vector<int> &v1, const vector<int> &v2){
    if (v1[0] == v2[0])
        return v1[1] < v2[1];
    return v1[0] > v2[0];
});
```
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> sortByBits(vector<int>& arr) {
        vector<int> bit(10001,0);
        for(int i=1;i<=10000;i++){
            bit[i]=bit[i>>1]+(i&1);
        }
        sort(arr.begin(),arr.end(),[&](int x,int y){
            if(bit[x]<bit[y]) return true;
            if(bit[x]>bit[y]) return false;
            return x<y;
        });
        return arr;
    }
};
int main(){
    vector<int> arr={0,1,2,3,4,5,6,7,8};
    Solution sol;
    vector<int> ans=sol.sortByBits(arr);
    for(int i:ans) cout<<i<<" ";
    cout<<endl;
    return 0;
}
```