---
title: 26fall做题记录 - September
description: 2026.9做题记录
publishedAt: 2026-09-07
tags:
  - 算法
  - Cpp
  - 数据结构
---
```
<details>
  <summary>点击查看详细内容</summary>
  <div class="details-content">
    <p>第三个学期上yhf的课，依旧将复健作为一个学期的开始。自入校以来的几乎每一天，每日选做都始终在Chrome的待办区，大部分时候打开电脑也都有一个或好几个尚未完成的题目窗口。有时思考缓慢，有时急于求成，也不总是在此取得满意的成绩，但总会痴迷于学习一个新的算法，每一次AC弹出时都万分欣喜。总觉得作为一个ai专业的学生我还不够合格，就算vibe其他工作也要古法手搓每一道算法题，也更偏爱算法课程——上了大学依旧像一个oier。当然，作为一个oier，曾经的我更是不够合格。不过以前的事情倒也不再重要，做点虽然很累，但是有用，并且开心的事情，也挺好的。于是享受这一刻——独自一人，随时随地打开电脑，就是一个完整的世界。</p>
  </div>
</details>
```

# 2026.9.8
## [Fraction类](http://cs101.openjudge.cn/pctbook/E27653/)
一个callback，同样是上学期的第一道题。此入暑假没有补程设普通班的东西，OOP已经忘光光了……我忏悔。

重载+和<<运算符，由于cout的输出顺序，operator<<写成类外友元函数。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Fraction{
private:
    int numerator;//分子
    int denominator;//分母
    int gcd(int a,int b){
        if(a<0) a=-a;
        if(b<0) b=-b;
        if(a==0) return b;
        while(b!=0){
            int r=a%b;
            a=b;
            b=r;
        }
        return a;
    }
    void simplify(){
        if(denominator<0){
            numerator=-numerator;
            denominator=-denominator;
        }
        int g=gcd(numerator,denominator);
        numerator/=g;
        denominator/=g;
    }
public:
    Fraction(int n=0,int d=1){
        numerator=n;
        denominator=d;
        simplify();
    }
    // Fraction add(Fraction other){
    //     int n=numerator*other.denominator+denominator*other.numerator;
    //     int d=denominator*other.denominator;
    //     return Fraction(n,d);
    // }
    Fraction operator+(Fraction other){
        int n=numerator*other.denominator+denominator*other.numerator;
        int d=denominator*other.denominator;
        return Fraction(n,d);
    }
    // void print(){
    //     if(denominator<0){
    //         numerator=-numerator;
    //         denominator=-denominator;
    //     }
    //     else if(numerator%denominator==0){
    //         cout<<numerator/denominator<<endl;
    //         return;
    //     }
    //     else cout<<numerator<<"/"<<denominator<<endl;
    // }
    friend ostream& operator<<(ostream& os,const Fraction &f){
        if(f.numerator%f.denominator==0){
            os<<f.numerator/f.denominator;
        }
        else os<<f.numerator<<"/"<<f.denominator;
        return os;
    }

};
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int a,b,c,d;
    cin>>a>>b>>c>>d;
    Fraction f1(a,b),f2(c,d);
    Fraction result=f1+f2;
    cout<<result<<endl;
}
```
# 2026.9.8
## [模型整理](http://cs101.openjudge.cn/pctbook/M27300/)
1.map：红黑树，自动按key排序

unordered_map：哈希表，无序

2.字符串查找/分隔：find()。返回类型为size_t
```cpp
size_t pos=s.find('-');
if(pos!=string::npos){
	//操作
}
```
3.getline()输入一整行，但如果与cin混用，在getline之前需要`cin.ignore()`

4.取字符串的最后一位：`.back()`

5.`s.substr(pos,len)//起始位置，字符数`

6.string转double:`stod()`

string转int:`stoi()`

7.遍历map
```cpp
for (auto& [key, value] : myMap) {
	cout << key << ": " << value << endl;
}

for (auto it = myMap.begin(); it != myMap.end(); ++it) {
	cout << it->first << ": " << it->second << endl;
}
```

```cpp
#include<bits/stdc++.h>
using namespace std;
bool cmp(const string& a,const string& b){
    char y1=a.back(),y2=b.back();
    double x1=stod(a.substr(0,a.size()-1)),x2=stod(b.substr(0,b.size()-1));
    if(y1==y2) return x1<x2;
    else if(y1=='M' and y2=='B') return true;
    else return false;
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin>>n;
    map<string,vector<string>> a;
    for(int i=0;i<n;i++){
        string s;
        cin>>s;
        size_t pos=s.find('-');
        if(pos!=string::npos){
            string name=s.substr(0,pos);
            string size=s.substr(pos+1);
            a[name].push_back(size);
        }
    }
    for(auto& [name, sizes]:a){
        sort(sizes.begin(),sizes.end(),cmp);
        cout<<name<<": ";
        int n=sizes.size();
        for(int i=0;i<n-1;i++){
            cout<<sizes[i]<<", ";
        }
        cout<<sizes[n-1]<<endl;
    }
    return 0;
}
```
## 位运算
（跳过大量位运算题目）
## [统计单比特整数](https://leetcode.cn/problems/count-monobit-integers/)
1.进制转换
```cpp
cout << oct << x << endl; // 八进制
cout << hex << x << endl; // 十六进制
cout << dec << x << endl; // 十进制
cout << bitset<8>(x) << endl;//固定输出八位
```
2.计算二进制位数
`floor(log2(n))+1`

3.计算二进制中1的个数
```cpp
__builtin_popcount(n)

while (n > 0) {
	n &= (n - 1);  // 清除最低位的 1
	count++;
}
```

```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int countMonobit(int n) {
        if(n==0) return 1;
        int ans=floor(log2(n))+1;
        if(ans==__builtin_popcount(n)) ans++;
        return ans;
    }
};
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    Solution sol;
    cout << sol.countMonobit(4)<<endl;
    return 0;
}
```