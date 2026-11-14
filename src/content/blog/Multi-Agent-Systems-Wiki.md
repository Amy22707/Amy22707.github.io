---
title: Multi-Agent Systems 研究笔记
description: 多 Agent 知识共享、协作评测与推理效率
publishedAt: 2026-11-05
updatedAt: 2026-11-10
tags:
  - Agents
  - Multi_Agent
  - AI_systems
  - LLM_Inference
---
<a id="topic-foundations"></a>
## 1. Foundations

本文收录同一个任务内多个 Agent 或子 Agent 如何传递证据、交付产物和协调执行，以及推理服务如何处理这些协作产生的请求。独立会话共享服务、多候选独立采样和同一任务内的协作分别记载。

- **语义共享** 指 Agent 传递结论、约束、接口约定或原始证据，接收者可以据此改变自己的行动。
- **制品共享** 指 Agent 通过代码补丁、文件、测试日志或可检索记录交接工作。制品存在和另一位 Agent 已读取它是两个事件。
- **计算复用** 指引擎利用已处理的 token 前缀等状态省下重复计算。相同文本能否复用 KV 还取决于模型、前缀位置、token 化和缓存驻留。
- **依赖就绪** 指后续工作所需的产物已经可用。任务可以并发启动，但其中某些操作仍然需要等待前序 Agent 交付。

<a id="topic-measurement"></a>
## 2. Measurement

<a id="paper-2601-13295"></a>

### 2.1 CooperBench：用双功能合并验收衡量编码协作

[论文](https://arxiv.org/abs/2601.13295) · [代码](https://github.com/cooperbench/CooperBench)

**主张与研究方法：** 给两个 Agent 同一仓库快照和各自的功能需求，在隔离工作区开发。两项功能可以共存，但实现可能触及同一段代码或依赖同一接口。对照组让单 Agent 处理两项功能，评测器合并双 Agent 的补丁，并用两套隐藏测试验收。

**主要结论：** 原论文覆盖 12 个库、652 个任务对。开放消息通道能降低部分模型的合并冲突，联合通过率的变化未达到统计显著。判断团队是否协作成功，需要同时看补丁能否合并和合并后的行为是否正确。

<a id="paper-2310-06770"></a>

### 2.2 SWE-bench：用真实 issue 和补丁测试验收仓库修复

[论文](https://arxiv.org/abs/2310.06770) · [项目与榜单](https://www.swebench.com/)

**主张与研究方法：** 输入为真实 GitHub issue 和问题发生前的仓库快照。提交补丁后，运行修复目标测试和回归测试。原版有 2,294 个任务，来自 12 个 Python 仓库。

**主要结论：** 该评测记录最终补丁是否解决问题。使用同一套任务和验收可以比较不同 Agent 组织方式，角色依赖、消息和完成时间需要在运行日志中另行记录。

<a id="paper-2610-24206"></a>

### 2.3 SWE-Bench Pro V2：审计长程仓库任务并固定验收协议

[论文](https://arxiv.org/abs/2610.24206) · [V2 工具与任务](https://github.com/scaleapi/SWE-bench_Pro-os/blob/main/v2/README.md)

**主张与研究方法：** 在 SWE-Bench Pro 的公开任务上审计题面、测试和可绕过的验收条件。修订版发布 642 个任务、公开容器和锁定协议，将 Agent 执行与最终重新评分隔离。

**主要结论：** V2 使不同运行更容易按同一规则比较。它仍以最终补丁验收为主，跨角色协作需要由 harness 单独记录。原版与 V2 的任务和评测条件有变化，版本需随结果明确标注。

<a id="paper-2605-03546"></a>

### 2.4 ProgramBench：从可执行程序重建软件行为

[论文](https://arxiv.org/abs/2605.03546) · [代码](https://github.com/facebookresearch/ProgramBench)

**主张与研究方法：** 给 Agent 一个空工作区、可运行的参考程序和相关文档。Agent 通过查询参考程序理解行为，提交独立实现，再用隐藏行为测试测兼容性。任务从命令行工具到 FFmpeg 等大型软件。

**主要结论：** 200 个任务覆盖程序重建，部分行为通过率可以反映未完全解决时的进展。Cohere 的团队研究用它比较规划、实现和验证三阶段的委派成本。

<a id="paper-2611-08417"></a>

### 2.5 Terminal-Bench 2.1：将任务与资源预算一起纳入版本管理

[论文](https://arxiv.org/abs/2611.08417) · [项目](https://www.tbench.ai/) · [Terminal-Bench 原论文](https://arxiv.org/abs/2601.11868)

**主张与研究方法：** Terminal-Bench 提供容器化终端任务和可执行验证器。维护论文检查指令、验证器、环境和资源限制，修复审计发现的问题，并发布 2.1。

**主要结论：** 题面、验证器或预算有差异时，分数差距可能来自评测条件。跨 Agent 或跨 harness 比较应记录具体任务版本、运行预算与验收配置。

<a id="paper-2409-11363"></a>

### 2.6 CORE-Bench：用论文代码与数据测计算复现

[论文](https://arxiv.org/abs/2409.11363) · [代码与任务](https://github.com/siegelz/core-bench)

**主张与研究方法：** 给 Agent 论文已有代码和数据，要求运行相关流程并回答结果问题。数据含 90 篇论文派生的 270 个任务，覆盖计算机、社会科学与医学。

**主要结论：** 论文评估了 AutoGPT 和 CORE-Agent，使用 GPT-4o、GPT-4o-mini。验收是复现结果的准确率。数据准备、运行和结果核对可以形成依赖链，跨角色协作需要在该任务上另行定义和测量。

<a id="paper-2609-04298"></a>

### 2.7 Harbor Adapters：验证评测迁移前后的结果口径

[论文](https://arxiv.org/abs/2609.04298) · [适配器代码](https://github.com/harbor-framework/adapters)

**主张与研究方法：** 将不同 benchmark 转换为统一任务格式，封装指令、环境和验证器，再用相同模型与 Agent 对比原始 runner 和适配后的结果。

**主要结论：** CooperBench 的适配检查覆盖 50 个任务对，使用 OpenHands SDK 与 Gemini 3 Flash。该检查属于迁移一致性验证，CooperBench 未进入论文的大规模主实验。

<a id="paper-2512-08296"></a>

### 2.8 Capable language models can outgrow the benefits of collaboration：单 Agent 基线如何决定组队收益

[论文](https://www.nature.com/articles/s42256-026-01268-y)

**主张与研究方法：** 作者固定工具、提示和计算预算，对比单 Agent、独立并行、中心协调、去中心化与混合五种结构。正式版覆盖六个 benchmark 和 260 个配置，使用 Gemini、GPT、Claude 模型。SWE-bench Verified 和 Terminal-Bench 用于验证协作收益的判断规则。

**主要结论：** 单 Agent 基线表现是最稳健的收益预测变量。基线已经很强时，额外协调通常更难带来收益。作者用留出配置验证了选择规则，跨任务域的绝对分数预测较弱。发表页面附可下载的配置级结果。

<a id="paper-2610-32131"></a>

### 2.9 Pairing Matters：在同一推理服务上比较模型与 Harness

[论文](https://arxiv.org/abs/2610.32131) · [实验记录与分析代码](https://github.com/lisazhao-gz/pairing-matters)

**主张与研究方法：** 将 Qwen3-Coder-Next、Devstral-Small 和 GLM-4.7-Flash，与 OpenCode、OpenHands、mini-SWE-agent、SWE-agent、AutoCodeRover、Agentless 两两组合。在固定的 100 个 SWE-bench Verified 任务上完成 1,800 次评分运行。用单张 H100 NVL 上的 vLLM 顺序部署各模型，harness 运行在单独的 CPU 主机，统一记录调用和验收。

**主要结论：** 同一模型的任务解决率随 harness 改变，最大差异为 44 个百分点。按成功任务归一的计费 token 也可相差 20 倍以上。结果涵盖失败运行的成本。额外执行限制和超时因 harness 而异，数值对应论文实测组合。

<a id="topic-sharing"></a>

## 3. Knowledge and Plan Reuse

<a id="paper-2610-06481"></a>

### 3.1 AECP：在读取代码时交付知识，在提交代码时检查约定

[论文](https://arxiv.org/abs/2610.06481)

**主张与研究方法：** 多个编码 Agent 并行工作时，普通消息需要接收者自行记住何时使用某条发现，也需要上下游自行检查约定有没有落实。AECP 让一个负责人划分模块，再用两类结构化产物协调并行 worker。

1. **知识产物。** Worker 提交发现、适用的函数或文件，以及可选的可执行证据。Harness 在其他 worker 读取相关代码时把发现随工具结果交付。证据检查失败的发现可以撤回。
2. **契约产物。** 上游声明公开符号和签名。Harness 据此生成可导入的接口桩，让下游能先开发。上游提交实现时，harness 检查可静态判断的接口偏差。若契约改版，使用旧约定的下游需要重新检查自己的实现。

**主要结论：** 在 Doc2Repo、NL2Repo 和 CodeProjectEval 的从规格生成仓库任务中，作者报告 AECP 相比两种团队基线提高隐藏测试通过率、缩短墙钟时间。相比单 Agent，它平均使用更多输出 token。与集成者基线的第一步消融同时引入共享工作区和知识产物，因此该对比无法单独归因于知识投递。主实验使用 AWS Strands Agents SDK，另用 mini-SWE-agent 做一组复核。Claude Opus 4.8、Opus 4.6 与 Sonnet 5 通过 Bedrock 调用，DeepSeek-V4-Flash 与 GLM-5.2 通过 OpenRouter 调用。底层引擎和硬件未披露。

<a id="paper-2602-05965"></a>

### 3.2 Learning to Share：学习哪些中间结果值得跨团队共享

[论文](https://arxiv.org/abs/2602.05965) · [会议](https://proceedings.mlr.press/v306/fioresi26a.html) · [代码](https://github.com/UCF-CRCV/autogen-lts) · [控制器权重](https://huggingface.co/jfioresi/lts-decision-transformer)

**主张与研究方法：** 多个团队对同一任务并行探索，会重复搜索、解析和写代码。Learning to Share（LTS）在任务内建立共享记忆库，并训练小控制器判断每一步结果是否值得写入。主设置含三个并行的 MagenticOne 式团队，每队内部由负责人调度专门 Agent，最终仍用原 M1-Parallel 策略聚合答案。

1. **保存摘要与原始输出。** 每一步额外生成简短自然语言摘要，以摘要为 key、原始输出为 value。各队负责人看到已收录摘要，自行选择读取完整结果，避免直接加载所有团队的完整轨迹。
2. **学习写入决策。** 控制器读取任务、已有摘要、当前输入／输出／摘要的嵌入表示，通过可训练投影和 Qwen3-0.6B 控制器输出 YES 或 NO。它学习信息的下游用途，写入决策本身没有为文本提供可执行正确性证明。
3. **用使用情况分配奖励。** 基础奖励结合最终聚合答案和最先完成团队的答案质量。某条已写入记忆后来被读取，且任务得到非零奖励时，该决策获得额外奖励。稀疏正则惩罚过多写入。任务 Agent 保持冻结，只训练控制器 LoRA 与投影层。

例如一队已解析出网页表格，另一队看到摘要后直接读取解析结果，省去重复访问和解析。共享记忆仅在当前任务内存在，原方法没有删除或修订已存条目的机制。

**主要结论：** 作者在 AssistantBench 和 GAIA 上报告，相比无记忆的并行团队，LTS 改善任务分数并减少完整任务墙钟时间。全部写入的版本也能提速，但部分设置准确率下降。学习筛选在质量与时间之间取得不同取舍，例如 AssistantBench 的 GPT-5.1 设置中全部写入更快，LTS 分数更高。控制器推理与摘要生成是两项独立开销。

任务模型为 GPT-5.1 或 Qwen3-32B，控制器仅用 AssistantBench 的 33 道开发题训练，GAIA 不参与训练。公开实现基于 AutoGen/MagenticOne，论文报告单张 H100 与 PyTorch，底层服务引擎及精确版本未披露。代码、控制器适配器及投影权重公开。

<a id="paper-2609-09233"></a>

### 3.3 Subagents vs Agent Skills：用输入输出接口封装子任务上下文

[论文](https://arxiv.org/abs/2609.09233)

**主张与研究方法：** 同一份技能包可以在主 Agent 中加载执行，也可以交给独立上下文中的子 Agent。技能包包含说明、脚本等资源。前者把说明与执行过程留在主上下文，后者仅接收明确输入，并向父 Agent 返回最终结果，内部执行轨迹被隔离。

1. **明确接口。** 技能说明写清适用条件、需要的输入和必须返回的输出，内部说明给出完成该过程的步骤。父 Agent 据此选择技能并提供输入。
2. **固定包内容比较执行方式。** 分别用原始人工技能包和带过程说明及输入输出接口的合成包，比较主上下文执行与子 Agent 执行。合成包来自 GPT-5.3 Codex 成功轨迹，再经 Copilot CLI 整理。87 道 SkillsBench 任务中有 64 道成功生成技能包，结果报告在该子集上。
3. **增加上下文干扰。** 向可用技能列表加入不需要的技能描述，观察准确率随上下文压力变化。同时测最大上下文长度、总 token 和技能调用次数。

**主要结论：** 原人工技能包下，主上下文执行持平或更好；换成带清楚接口的过程型包后，子 Agent 执行更好，并在干扰技能增多时更稳定。子 Agent 总 token 明显增加。较小模型的最大上下文未必下降，作者认为部分主 Agent 运行提前失败，导致上下文较短。两套包还改变了内容和过程说明，因此跨包结果无法单独归因于输入输出接口。

主比较覆盖七种模型，包括 Qwen3.5-9B、Ministral-8B、Gemma-4-12B、Mistral-Large-3.1、gpt-5.4-mini、Kimi-K2.6 和 gpt-5.3-codex。执行使用修改后的 OpenHands SDK 与任务 Docker 容器，统一代理记录调用；延长子 Agent 工具超时，并禁用原生技能和自动检索。开放权重模型由 A100 节点上的 vLLM 服务，大模型或闭源模型走托管 API。专用复现仓库及合成技能包的发布状态未核实。

<a id="paper-2609-32965"></a>

### 3.4 Relic：将重复协作故障转成可执行团队规则

[论文](https://arxiv.org/abs/2609.32965v2) · [完整论文与附录 K](https://www.hongyidu.ai/relic/en/paper)

**主张与研究方法：** 成员从工作记录中提炼规则，经过提议和采纳后，把触发条件、责任人、所需证据和运行时动作绑定到团队协议。成员更换时，已有规则可以继续生效，也可以修订或退役。

**主要结论：** Relic v2 论文在 CooperBench 上按统一排除条件保留 469 对，Relic 通过 371 对。同模型的 47 对中，Relic 通过 28 对，单 Agent 26 对，普通双 Agent 13 对。全量对比包含已发布参考结果，结论需连同任务筛选与同模型对照阅读。

<a id="topic-serving"></a>

## 4. Scheduling and KV

<a id="paper-2405-19888"></a>
### 4.1 Parrot：让服务端看到自然语言工作流的数据依赖

[论文](https://www.usenix.org/conference/osdi24/presentation/lin-chaofan) · [代码](https://github.com/microsoft/ParrotServe)

**主张与研究方法：** 常规请求接口看到的是各自完整的 prompt，应用内部“谁产生这段内容、谁接下来消费”的关系容易丢失。Parrot 用 **Semantic Variable（语义变量）** 显式标记 prompt 里的输入和输出槽位。变量的值可以是自然语言或代码，生产者与消费者通过同一变量建立依赖。

1. **把变量接入请求图。** 编排器提交带变量引用的请求。服务端按引用增量建立数据依赖图，能够识别前序输出、依赖它的请求以及可并行的请求组。
2. **将应用目标传到请求调度。** 以最终输出为观察点分析依赖，把应用完成时间或吞吐目标落实到请求的调度与 batching。
3. **复用共同上下文。** 多个消费者若把同一段动态产生的语义变量安排成共同前缀，系统可以共享对应 KV。Parrot 也实现了面向共享前缀的 attention 计算路径。

例如架构师生成项目目录和接口说明。多个编码 Agent 都需要它，但各自负责不同文件。语义变量把这段共享产物及其消费者显式告诉服务端，让消费者并行、共享共同前缀，也让最后的集成请求知道要等哪些文件。

**主要结论：** 论文 §8.4 在一张 A100 上用 LLaMA 13B 运行 MetaGPT 式的架构师、编码者、审查者工作流，观察到端到端时间与 KV 内存改善。共享前缀、调度批次和专门 attention 实现都贡献了收益。实测比较采用论文当时的 FastChat／vLLM 等基线，主要回答服务效率问题。该组结果没有用现代仓库修复闭环来验证代码正确率。代码公开为 ParrotServe，较大系统实验还包含其他应用与 LLaMA 7B。

<a id="paper-2610-08647"></a>

### 4.2 SquidAgent：继承规划上下文，按预计协调成本选择并行

[论文](https://arxiv.org/html/2610.08647v1) · [代码](https://github.com/tmllab/2026_NeurIPS_SquidAgent)

**主张与研究方法：** 并行 worker 节省的执行时间，需要覆盖重新探索上下文和最终对齐产物的开销。SquidAgent 在规划时同时生成子任务依赖图、各任务预计输出 token 数和每层预计协调 token 数。依赖图按拓扑层分组，同层任务满足依赖后可以并行。

1. **继承上下文。** Worker 从负责人的会话分叉，获得已有架构决策、约束和计划，减少重新理解任务。当前仓库的 worktree 模式使用会话分叉与独立分支，agent-tool 模式向子 Agent 交付计划和约定。
2. **提前统一约定。** 启动并行层前，负责人写出命名、接口、格式及跨文件引用规则，降低产物完成后的对齐开销。
3. **逐层决定串并行。** 设任务预计输出长度为 $\tau_i$，协调开销为 $\widehat C$，调度器比较 $\sum_i\tau_i$ 与 $\max_i\tau_i+\widehat C$。只有前者与后者的比值超过阈值才并行，否则由负责人串行完成。这个最大值估计的是并行关键路径，不是所有 worker 的总 token 消耗。

例如两项任务各预计输出 1,000 token，协调约定需要 100 token，比值为 $2000/1100\approx1.82$。主实验阈值为 1.9，这层会串行执行。

**主要结论：** 在九个自建编码、技术写作和规划任务上，作者报告相较 Claude Code 的平均墙钟加速约为 2.6 倍，交付词数／秒提高约为 2.2 倍。该吞吐定义同时受产物长度和完成时间影响，质量另由 Claude Opus 4.6 对任务条目评分。实验执行模型为 Claude Sonnet 4.6。生成长度对模型生成主导的任务有预测价值，工具执行、外部 API 和服务排队还需要单独计时。当前评测以自建产物任务为主。

系统基于 Claude Agent SDK，公开代码支持 Git worktree 隔离。底层推理引擎和服务器硬件未披露。论文提示词及任务描述公开，无需训练新模型。

<a id="paper-2602-01053"></a>

### 4.3 LRAgent：共享基础缓存，用低秩缓存保留角色差异

[论文](https://arxiv.org/html/2602.01053v2) · [会议](https://proceedings.mlr.press/v306/jeon26b.html) · [代码](https://github.com/hjeon2k/LRAgent)

**主张与研究方法：** 多个角色共享一个基础模型，并用各自的 LoRA 适配器专门化后，对相同历史仍会产生不同 KV。LoRA 用两个小矩阵 $A_i,B_i$ 表示权重更新，投影为 $X_iW_0+(X_iA_i)B_i$。LRAgent 利用基础投影高度相似的观察，把缓存拆成可共享部分和适配器相关部分。

1. **BaseShared。** 对相同历史共享基础 value 缓存，角色差异以低秩中间量 $X_iA_i$ 保存，使用时通过 $B_i$ 恢复。主设置在 Q、V 投影上使用 LoRA，并共享 key 缓存。它主要节省存储，各角色仍需计算自己的低秩历史。
2. **BaseLRShared。** 训练各角色共用下投影 $A$、保留各自上投影 $B_i$。基础缓存和低秩缓存都共享，后继角色复用历史，只为新追加内容执行 prefill。不同角色的层输入存在差异，跨角色缓存复用依赖相似性近似。
3. **Flash-LoRA-Attention。** 设注意力权重为 $P$，低秩 value 为 $V_{lr}$，通过 $P(V_{base}+V_{lr}B_i)=PV_{base}+(PV_{lr})B_i$ 改变运算顺序。先在低秩空间做加权求和，再升维，避免为全部历史 token 展开完整角色 value 缓存。

**主要结论：** 作者在 LLaMA-3.1-8B-Instruct、Ministral-8B-Instruct 的规划／行动／反思三角色问答中，观察到该拆分比直接共享整个缓存更好地保留准确率，同时降低显存与重复 prefill 开销。BaseLRShared 需要共享 $A$ 的适配器训练。主系统加速在相同长度轨迹上测量，准确率在 HotpotQA、ScienceQA 上测量，另有实际 HotpotQA 延迟结果。

执行框架沿用 AutoAct 角色划分，公开实现修改 FastChat、Transformers、PEFT 和 FlashAttention。实验硬件为单张 NVIDIA A6000 48GB。训练与执行代码公开，完整预训练好角色权重的发布情况未核实。

<a id="paper-2609-34060"></a>

### 4.4 KVCMAS：沿 Agent 工作流传递并修正共享上下文 KV

[论文](https://arxiv.org/html/2609.34060) · [代码](https://github.com/hjeon2k/KVCMAS)

**主张与研究方法：** 同一模型的多个角色可以读取相同的用户需求和工具结果。角色提示位于共享内容之前时，注意力会使同一段文本产生不同的 KV。KVCMAS 为共享段估计角色切换造成的差值，角色独有的前缀仍单独处理。

1. **从上游缓存开始。** 首个 Agent 正常 prefill。传给下一角色时，先把共享段的 key 对齐到目标位置，用上游已经产生的缓存作为参考。
2. **匹配历史修正。** 每个共享槽保存一些历史锚点，包含参考 KV 和跨角色差值。用截断奇异值分解压缩这些矩阵，再按与当前缓存的相似度对差值加权。
3. **按匹配置信度选择路径。** 匹配集中时，将估计差值加到上游缓存，并生成目标角色的完整维度 KV 供普通 attention 使用。匹配不可靠时，目标角色重新 prefill，该次完整计算也可提供新锚点。生成的目标 KV 可作为下一次交接的参考。

**主要结论：** 在五项文本与视觉语言基准中，KVCMAS 多数情况下比其他共享方法更接近完整 prefill 的分数。较长共享上下文的受控回放中，作者报告 32K token、8 QPS 时的中位 TTFT 约为不共享方法的一半。该结果来自固定四 Agent 调用轨迹，完整任务质量另用实际生成的基准轨迹测量。

质量评测使用 KVComm 框架的三个任务角色及一个反思角色。Llama-3.1-8B-Instruct 跑 MMLU／GSM8K，Qwen2.5-Coder-7B-Instruct 跑 HumanEval，LLaVA-OneVision-7B 跑 MathVista／Video-MME。并发回放使用 vLLM 与 A100 80GB，单流效率使用 A6000 48GB。代码和实验入口公开，修正锚点在线构建。

<a id="paper-2605-10913"></a>

### 4.5 Shepherd：用可分叉执行轨迹实施运行时监督

[论文](https://arxiv.org/abs/2605.10913)

**主张与研究方法：** 将 Agent 与环境的交互记为可订阅的事件流。两个 worker 在隔离环境并行，监督者从两边观察文件和工具事件，发现冲突时注入信息，也可让一边从另一边的状态接续。

**主要结论：** 479 个结构性冲突任务对上，无监督并行联合通过率为 28.8%，Opus 监督为 54.7%，单 Agent 为 57.2%。平均耗时分别为 19.8、24.2、28.4 分钟。实验同时展示了监督的时间开销和质量收益，模型费用需要另行核算。

<a id="paper-2610-17471"></a>

### 4.6 Scaling Inference-Time Compute with Teams of Coding Agents：比较规划、实现与验证的委派成本

[论文](https://arxiv.org/abs/2610.17471)

**主张与研究方法：** 在同一个轻量 harness 中，比较单 Agent、同步或异步委派、在哪个阶段使用 worker，以及不同强度模型组成的团队。Worker 通过明确子任务启动，完成后交付结果。

**主要结论：** ProgramBench 的一组同构对照里，只委派规划能以约一半推理费用获得接近全阶段委派的分数。异步减少负责人等待，也可能在结果未齐时提前行动。实验分别报告分数、费用和墙钟时间。

<a id="paper-2609-38345"></a>

### 4.7 OpenCollab：用同一运行时控制团队结构和预算

[论文](https://arxiv.org/abs/2609.38345) · [代码](https://github.com/RISE-X-Lab/OpenCollab)

**主张与研究方法：** 同一运行时支持单 Agent、由模型选择交接的团队，以及代码指定交接顺序的工作流。运行时控制消息可达边和预算，并记录角色事件，用 Adherence 检查预定组织是否实际发生。

**主要结论：** 同一模型的跨 harness 对照中，Duo 提升所测任务的通过率，Base 在该表的三个基准上使用的 token 和费用最低。应把通过率、成本和角色实际参与一起解读。

<a id="paper-2603-16104"></a>

### 4.8 Helium：用工作流依赖安排调用和缓存

[论文](https://arxiv.org/abs/2603.16104)

**主张与研究方法：** 把 LLM 调用和依赖表示成查询计划。在多个角色的工作流中，按计划识别可并行调用和共享前缀，再调度请求并准备 KV。

**主要结论：** 实验含辩论、反思、并行汇总等模式，在 Qwen3-8B／14B 与 H100 NVL 上评估，多数实验使用 vLLM v0.16.0。论文主要测已定义工作流的端到端执行时间，任务与开放式仓库修复不同。

<a id="paper-2609-34683"></a>

### 4.9 AgentPerfBench：用多轮请求轨迹衡量推理服务性能

[论文](https://arxiv.org/abs/2609.34683) · [公开数据](https://huggingface.co/datasets/agent-perf-bench/AgentPerfBench)

**主张与研究方法：** 使用 SWE-Bench、TerminalBench、OSWorld 和聊天来源的轨迹，提供录制请求回放及由请求分布合成的负载。回放保持会话内请求顺序，并扫描并发。

**主要结论：** 在 vLLM 和 SGLang 上记录 TTFT、输出 token 间隔、吞吐及缓存相关指标。合成负载需要保留前缀结构，仅匹配输入输出长度会丢失缓存行为。数据测的是模型请求服务，与最终任务验收分开。

<a id="paper-2611-08723"></a>

### 4.10 DeCAF：拆开优化 Harness，再验证组合的收益

[论文](https://arxiv.org/html/2611.08723)

**主张与研究方法：** 从种子工作流出发，把提示词、模型、拓扑和工具策略分成多个优化维度。多个独立编码 Agent 按限定范围实验，再由整合 Agent 根据开发集结果和组件轨迹组合修改，最终用留出集测质量、推理成本和延迟。

**主要结论：** 论文覆盖 AppWorld、LiveCodeBench、AgentDojo、PostTrainBench v1.1。相对 Meta-Harness，作者报告部署时平均延迟降低 42.45%、成本降低 4.30%、任务分数提高 2.58 个百分点。寻找方案的一次性优化成本平均增加 17.98%。部署收益与搜索开销分开计量。

<a id="topic-synthesis"></a>

## 5. Survey

<a id="survey-overview"></a>
<a id="survey-mapping"></a>
<a id="survey-comparison"></a>

四张表分别从 **Benchmark、Harness、推理引擎、任务** 查论文。左列是查询项，右列的链接指向论文正文。

### 5.1 按 Benchmark 查

| Benchmark／负载                                               | 相关论文                                                                                                                            |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **CooperBench**（双功能联合验收）                                   | [CooperBench](#paper-2601-13295)、[Shepherd](#paper-2605-10913)、[Relic](#paper-2609-32965)、[Harbor Adapters](#paper-2609-04298)  |
| **SWE-bench 原版**                                           | [SWE-bench](#paper-2310-06770)                                                                                                  |
| **SWE-bench Verified**                                     | [Pairing Matters](#paper-2610-32131)、[Capable Language Models](#paper-2512-08296)（补充验证）                                         |
| **SWE-Bench Pro**                                          | [OpenCollab](#paper-2609-38345)（论文子集）                                                                                           |
| **SWE-Bench Pro V2**                                       | [SWE-Bench Pro V2](#paper-2610-24206)（锁定协议）                                                                                     |
| **ProgramBench**（从参考可执行程序重建）                               | [ProgramBench](#paper-2605-03546)、[Cohere 编码团队研究](#paper-2610-17471)、[Relic](#paper-2609-32965)                                 |
| **Terminal-Bench**                                         | [Terminal-Bench 2.1](#paper-2611-08417)、[OpenCollab](#paper-2609-38345)（2.1）、[Capable Language Models](#paper-2512-08296)（补充验证） |
| **DeepSWE**                                                | [OpenCollab](#paper-2609-38345)                                                                                                 |
| **Doc2Repo／NL2Repo／CodeProjectEval**（从规格生成仓库）              | [AECP](#paper-2610-06481)                                                                                                       |
| **GAIA／AssistantBench**                                    | [Learning to Share](#paper-2602-05965)                                                                                          |
| **SkillsBench**                                            | [Subagents vs Agent Skills](#paper-2609-09233)                                                                                  |
| **CORE-Bench**（用已有代码、数据计算复现）                               | [CORE-Bench](#paper-2409-11363)                                                                                                 |
| **AppWorld／LiveCodeBench／AgentDojo／PostTrainBench**（工作流优化） | [DeCAF](#paper-2611-08723)                                                                                                      |
| **论文自建工作流**（编码、问答、辩论或汇总）                                   | [SquidAgent](#paper-2610-08647)、[Parrot](#paper-2405-19888)、[Helium](#paper-2603-16104)                                         |
| **文本／视觉语言基准与受控服务轨迹**（任务质量与回放分别登记）                          | [LRAgent](#paper-2602-01053)、[KVCMAS](#paper-2609-34060)、[AgentPerfBench](#paper-2609-34683)                                    |

### 5.2 按 Harness 查

| Harness／评测框架 | 相关论文 |
| --- | --- |
| **OpenHands／OpenHands SDK** | [CooperBench](#paper-2601-13295)、[Harbor Adapters](#paper-2609-04298)、[Subagents vs Agent Skills](#paper-2609-09233)、[OpenCollab](#paper-2609-38345)、[Pairing Matters](#paper-2610-32131) |
| **Claude Code／Claude Agent SDK**（区分原生 CLI 与 SDK；DeCAF 含 Claude Code 种子流程） | [SquidAgent](#paper-2610-08647)、[OpenCollab](#paper-2609-38345)、[DeCAF](#paper-2611-08723) |
| **Codex CLI** | [OpenCollab](#paper-2609-38345) |
| **mini-SWE-agent** | [ProgramBench](#paper-2605-03546)、[OpenCollab](#paper-2609-38345)、[AECP](#paper-2610-06481)、[Relic](#paper-2609-32965)、[Pairing Matters](#paper-2610-32131) |
| **OpenCode**（Shepherd 加事件流监督） | [Shepherd](#paper-2605-10913)、[Pairing Matters](#paper-2610-32131) |
| **Harbor／原生评测 runner**（任务封装、运行、重评分） | [Harbor Adapters](#paper-2609-04298)、[SWE-Bench Pro V2](#paper-2610-24206)、[Terminal-Bench 2.1](#paper-2611-08417)、[SWE-bench](#paper-2310-06770) |
| **OpenCollab** | [OpenCollab](#paper-2609-38345) |
| **AWS Strands** | [AECP](#paper-2610-06481) |
| **Relic 运行时** | [Relic](#paper-2609-32965) |
| **AutoGen／MagenticOne** | [Learning to Share](#paper-2602-05965) |
| **AutoGPT／CORE-Agent** | [CORE-Bench](#paper-2409-11363) |
| **论文自建 Agent 编排**（按各自工作流或拓扑实现） | [Capable Language Models](#paper-2512-08296)、[Cohere 编码团队研究](#paper-2610-17471)、[LRAgent](#paper-2602-01053)、[KVCMAS](#paper-2609-34060)、[DeCAF](#paper-2611-08723) |
| **服务／回放 harness**（Parrot API、Helium API、作者回放工具） | [Parrot](#paper-2405-19888)、[Helium](#paper-2603-16104)、[AgentPerfBench](#paper-2609-34683) |

### 5.3 按推理引擎查

| 推理引擎／服务口径 | 相关论文 |
| --- | --- |
| **vLLM**（SkillsBench 的开放模型组、KVCMAS 并发回放、Helium 多数实验、AgentPerfBench 回放、Pairing Matters 自托管） | [Subagents vs Agent Skills](#paper-2609-09233)、[KVCMAS](#paper-2609-34060)、[Helium](#paper-2603-16104)、[AgentPerfBench](#paper-2609-34683)、[Pairing Matters](#paper-2610-32131) |
| **SGLang**（服务回放对照） | [AgentPerfBench](#paper-2609-34683) |
| **Parrot Engine**（论文的服务实现） | [Parrot](#paper-2405-19888) |
| **修改 FastChat／Transformers**（Flash-LoRA-Attention） | [LRAgent](#paper-2602-01053) |
| **模型 API／底层引擎未披露或未核实**（API、模型和引擎分别记录） | [CooperBench](#paper-2601-13295)、[Harbor Adapters](#paper-2609-04298)、[Shepherd](#paper-2605-10913)、[AECP](#paper-2610-06481)、[Learning to Share](#paper-2602-05965)、[Relic](#paper-2609-32965)、[SquidAgent](#paper-2610-08647)、[Cohere 编码团队研究](#paper-2610-17471)、[OpenCollab](#paper-2609-38345)、[CORE-Bench](#paper-2409-11363)、[Capable Language Models](#paper-2512-08296)、[DeCAF](#paper-2611-08723) |
| **引擎随运行配置**（基准与验收协议） | [SWE-bench](#paper-2310-06770)、[SWE-Bench Pro V2](#paper-2610-24206)、[ProgramBench](#paper-2605-03546)、[Terminal-Bench 2.1](#paper-2611-08417) |

### 5.4 按任务查

| 任务                         | 相关论文                                                                                                                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **两个 Agent 开发相邻功能，合并后验收**  | [CooperBench](#paper-2601-13295)、[Shepherd](#paper-2605-10913)、[Relic](#paper-2609-32965)、[Harbor Adapters](#paper-2609-04298)                                                         |
| **在真实仓库修 issue，验证修复和回归**   | [SWE-bench](#paper-2310-06770)、[SWE-Bench Pro V2](#paper-2610-24206)、[OpenCollab](#paper-2609-38345)、[Pairing Matters](#paper-2610-32131)、[Capable Language Models](#paper-2512-08296) |
| **按规格生成仓库，或从参考程序重建行为**     | [AECP](#paper-2610-06481)、[ProgramBench](#paper-2605-03546)、[Cohere 编码团队研究](#paper-2610-17471)、[Relic](#paper-2609-32965)                                                              |
| **多步终端操作、工具调用和网页检索**       | [Terminal-Bench 2.1](#paper-2611-08417)、[OpenCollab](#paper-2609-38345)、[Learning to Share](#paper-2602-05965)、[Capable Language Models](#paper-2512-08296)、[DeCAF](#paper-2611-08723) |
| **按技能接口委派，控制父子 Agent 上下文** | [Subagents vs Agent Skills](#paper-2609-09233)                                                                                                                                         |
| **运行论文代码、数据，验收复现结果**       | [CORE-Bench](#paper-2409-11363)                                                                                                                                                        |
| **预定义多角色流程、角色接力问答与请求回放**   | [SquidAgent](#paper-2610-08647)、[Parrot](#paper-2405-19888)、[Helium](#paper-2603-16104)、[LRAgent](#paper-2602-01053)、[KVCMAS](#paper-2609-34060)、[AgentPerfBench](#paper-2609-34683)   |

<a id="survey-experiment-conditions"></a>

### 5.5 已报告的实验条件

容器资源、模型推理和训练分别计量。这里记录已公开的运行配置与预算上限。实际成本还随任务规模、重复次数、模型和并发变化。

- **CooperBench** 的原生 runner 支持 Docker、Modal 或 GCP，通信模式用 Redis。Shepherd 的监督对照每任务对用 3 个 E2B 沙箱，墙钟上限 3,300 秒，监督者也消耗模型配额。 [原生 runner](https://github.com/cooperbench/CooperBench) · [Shepherd 附录 E](https://arxiv.org/html/2605.10913)
- **SWE-Bench Pro V2** 提供公开 Linux 镜像、Harbor 任务与独立重评分。锁定协议每题 50 分钟。OpenCollab 使用自己的 SWE-Bench Pro 子集与预算，结果按各自口径登记。 [V2 协议](https://github.com/scaleapi/SWE-bench_Pro-os/blob/main/v2/README.md) · [OpenCollab 附录 B](https://arxiv.org/html/2609.38345)
- **Pairing Matters** 在一张 H100 NVL 上依次运行模型，Agent harness 在独立 CPU 主机。每次运行共用 262,144 个生成 token 上限，harness 还有各自的额外限制。 [实验设置 §II.D](https://arxiv.org/pdf/2610.32131)
- **推理服务对照** 中，Helium 的实测环境为两张 H100 NVL，每个模型实例占一张。KVCMAS 并发回放用 A100 80 GB，单流实验用 A6000 48 GB。 [Helium §7](https://arxiv.org/html/2603.16104#S7) · [KVCMAS §4](https://arxiv.org/html/2609.34060#S4)

<a id="materials-index"></a>
## 6. Materials Index

| 论文（原文）                                                                      | 主要内容                        | 本文位置                      |
| --------------------------------------------------------------------------- | --------------------------- | ------------------------- |
| [AECP](https://arxiv.org/abs/2610.06481)                                    | Harness 按代码范围投递发现，并检查接口契约   | [§3.1](#paper-2610-06481) |
| [Parrot](https://www.usenix.org/conference/osdi24/presentation/lin-chaofan) | 暴露文本产物的生产与消费关系，帮助调度和复用      | [§4.1](#paper-2405-19888) |
| [SquidAgent](https://arxiv.org/abs/2610.08647)                              | 继承上下文、提前写约定，按预计成本选择串并行      | [§4.2](#paper-2610-08647) |
| [LRAgent](https://arxiv.org/abs/2602.01053)                                 | 共享基础缓存与低秩历史，按角色重建适配器贡献      | [§4.3](#paper-2602-01053) |
| [Learning to Share](https://arxiv.org/abs/2602.05965)                       | 训练小控制器选择跨团队共享结果，摘要检索原始输出    | [§3.2](#paper-2602-05965) |
| [Subagents vs Agent Skills](https://arxiv.org/abs/2609.09233)               | 用技能接口隔离子任务执行，权衡主上下文与交接成本    | [§3.3](#paper-2609-09233) |
| [KVCMAS](https://arxiv.org/abs/2609.34060)                                  | 按角色修正共享段 KV，在线匹配低秩锚点        | [§4.4](#paper-2609-34060) |
| [CooperBench](https://arxiv.org/abs/2601.13295) | 用双功能合并验收衡量编码协作 | [§2.1](#paper-2601-13295) |
| [SWE-bench](https://arxiv.org/abs/2310.06770) | 用真实 issue 和补丁测试验收仓库修复 | [§2.2](#paper-2310-06770) |
| [SWE-Bench Pro V2](https://arxiv.org/abs/2610.24206) | 审计长程仓库任务并固定验收协议 | [§2.3](#paper-2610-24206) |
| [ProgramBench](https://arxiv.org/abs/2605.03546) | 从可执行程序重建软件行为 | [§2.4](#paper-2605-03546) |
| [Terminal-Bench 2.1](https://arxiv.org/abs/2611.08417) | 将任务与资源预算一起纳入版本管理 | [§2.5](#paper-2611-08417) |
| [CORE-Bench](https://arxiv.org/abs/2409.11363) | 用论文代码与数据测计算复现 | [§2.6](#paper-2409-11363) |
| [Harbor Adapters](https://arxiv.org/abs/2609.04298) | 验证评测迁移前后的结果口径 | [§2.7](#paper-2609-04298) |
| [Relic](https://arxiv.org/abs/2609.32965v2) | 将重复协作故障转成可执行团队规则 | [§3.4](#paper-2609-32965) |
| [Shepherd](https://arxiv.org/abs/2605.10913) | 用可分叉执行轨迹实施运行时监督 | [§4.5](#paper-2605-10913) |
| [Scaling Inference-Time Compute with Teams of Coding Agents](https://arxiv.org/abs/2610.17471) | 比较规划、实现与验证的委派成本 | [§4.6](#paper-2610-17471) |
| [OpenCollab](https://arxiv.org/abs/2609.38345) | 用同一运行时控制团队结构和预算 | [§4.7](#paper-2609-38345) |
| [Helium](https://arxiv.org/abs/2603.16104) | 用工作流依赖安排调用和缓存 | [§4.8](#paper-2603-16104) |
| [AgentPerfBench](https://arxiv.org/abs/2609.34683) | 用多轮请求轨迹衡量推理服务性能 | [§4.9](#paper-2609-34683) |
| [Capable language models can outgrow the benefits of collaboration](https://www.nature.com/articles/s42256-026-01268-y) | 单 Agent 基线如何决定组队收益 | [§2.8](#paper-2512-08296) |
| [Pairing Matters](https://arxiv.org/abs/2610.32131) | 在同一推理服务上比较模型与 Harness | [§2.9](#paper-2610-32131) |
| [DeCAF](https://arxiv.org/html/2611.08723) | 拆开优化 Harness，再验证组合的收益 | [§4.10](#paper-2611-08723) |
