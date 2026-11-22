---
title: Multi-Agent Systems 研究笔记
description: 多 Agent 知识共享、协作评测与推理效率
publishedAt: 2026-11-05
updatedAt: 2026-11-20
tags:
  - Agents
  - Multi_Agent
  - AI_systems
  - LLM_Inference
  - MAS
---
<a id="topic-foundations"></a>
## 1. Foundations

本文收录多 Agent 怎样分工、交换信息、交付代码，以及底层服务怎样减少这些调用的重复计算。

- **负责人／worker：** 负责人划分工作并整合结果；worker 是执行具体子任务的 Agent。
- **Harness（运行框架）：** 执行模型选择的工具操作、返回结果，并管理上下文、工作区、预算和任务停止条件的软件。
- **语义共享：** 传递结论、证据或接口约定，让接收者据此改变后续行动。
- **制品共享：** 通过代码补丁、文件、测试日志等具体成果交接工作；还要检查接收者是否读取并正确使用。
- **KV 缓存与 prefill：** 模型处理输入时产生的注意力中间状态称为 KV 缓存；prefill 是生成回答前处理整段输入的阶段，复用缓存可以省去部分重复输入计算。
- **依赖与关键路径：** 某项工作要等另一项结果才能继续，就存在依赖；决定整个任务最早何时完成的最长依赖链叫关键路径。

同一任务中的多个 Agent、对同一道题的独立候选探索，以及多个独立用户会话共享推理服务，分别讨论。

<a id="topic-measurement"></a>

## 2. Measurement

<a id="paper-2601-13295"></a>

### 2.1 CooperBench

[论文](https://arxiv.org/abs/2601.13295) · [代码](https://github.com/cooperbench/CooperBench)

**主张与研究方法：** CooperBench 检查两个编码 Agent 能否把各自的修改组合成一个正确的程序。每题提供同一仓库的初始代码，给 A、B 分别分配一个功能；双方起初只能看到自己的需求，在各自的工作区修改代码，通过消息了解对方的计划。两个功能在逻辑上可以共存，但可能修改同一个函数，或依赖同一个接口。

评测器把两份代码补丁合并，再运行两项功能各自的隐藏测试。合并失败，或者合并后只完成一项功能，都不算团队成功。Solo 对照让一个 Agent 直接完成两项功能；另比较开放与关闭消息通道，观察通信带来的变化。

**主要结论：** 在论文所测模型上，双 Agent 协作经常比单 Agent 完成两项功能更差。通信可以减少部分合并冲突，但未带来统计显著的联合通过率提升。失败不仅来自修改同一行代码，也来自接口理解不一致、承诺未兑现，以及没有将伙伴的计划落实到自己的实现中。

Resolving team conflicts requires not only task-specific competence, but also social intelligence to find common ground and build consensus. As AI agents increasingly collaborate on complex work, they must develop coordination capabilities to function as effective teammates. Yet we hypothesize that current agents lack these capabilities. To test this, we introduce **CooperBench**, a benchmark of over 600 collaborative coding tasks across 12 libraries in 4 programming languages. **Each task assigns two agents different features that can be implemented independently but may conflict without proper coordination.** Tasks are grounded in real open-source repositories with expert-written tests. Evaluating state-of-the-art coding agents, we observe **the curse of coordination**: agents achieve on average 30% lower success rates when working together compared to performing both tasks individually. This contrasts sharply with human teams, where adding teammates typically improves productivity. Our analysis reveals **three key issues**: (1) communication channels become jammed with vague, ill-timed, and inaccurate messages; (2) even with effective communication, agents deviate from their commitments; and (3) agents often hold incorrect expectations about others' plans and communication. Through large-scale simulation, we also observe rare but interesting emergent coordination behavior including role division, resource division, and negotiation. Our research presents a novel benchmark for collaborative coding and calls for a shift from pursuing individual agent capability to developing social intelligence.

<a id="paper-2310-06770"></a>

### 2.2 SWE-bench

[论文](https://arxiv.org/abs/2310.06770) · [项目与榜单](https://www.swebench.com/)

**主张与研究方法：** SWE-bench 把真实 GitHub issue 变成可自动验收的修复任务。Agent 拿到问题描述和修复前的仓库，需要查找相关代码、修改实现，最后提交一份补丁。

验收时把补丁应用到规定的仓库版本，运行两类测试：原来失败的目标测试是否通过，以及原来通过的相关测试是否仍然通过。这样可以检查“修好了这个问题，同时没有破坏已有功能”。原版包含 12 个 Python 仓库的 2,294 道题。

**主要结论：** 仓库修复需要联合理解多个函数、文件和执行结果，难度高于给定函数签名的代码生成。最终分数按解决的 issue 比例计算。研究者可以接入单 Agent 或多 Agent 系统，但任务分工、消息交换和耗时由运行框架另行记录。

Language models have outpaced our ability to evaluate them effectively, but for their future development it is essential to study the frontier of their capabilities. We find real-world software engineering to be a rich, sustainable, and challenging testbed for evaluating the next generation of language models. To this end, we introduce **SWE-bench**, an evaluation framework consisting of 2,294 software engineering problems drawn from real GitHub issues and corresponding pull requests across 12 popular Python repositories. **Given a codebase along with a description of an issue to be resolved, a language model is tasked with editing the codebase to address the issue.** Resolving issues in SWE-bench frequently requires understanding and coordinating changes across multiple functions, classes, and even files simultaneously, calling for models to interact with execution environments, process extremely long contexts and perform complex reasoning that goes far beyond traditional code generation tasks. Our evaluations show that both state-of-the-art proprietary models and our fine-tuned model SWE-Llama can resolve only the simplest issues. The best-performing model, Claude 2, is able to solve a mere 1.96% of the issues. Advances on SWE-bench represent steps towards LMs that are more practical, intelligent, and autonomous.

<a id="paper-2610-24206"></a>

### 2.3 SWE-Bench Pro V2

[论文](https://arxiv.org/abs/2610.24206) · [V2 工具与任务](https://github.com/scaleapi/SWE-bench_Pro-os/blob/main/v2/README.md)

**主张与研究方法：** 更强的 Agent 会发现旧题目和验收程序中的问题：题目没有说清要求、测试与要求矛盾，或 Agent 可以通过环境漏洞获得分数。SWE-Bench Pro V2 对原公开任务逐题审计，由工程师修订或删除有问题的任务，再由另一位工程师只根据修订后的题面独立实现，检查要求能否被正确理解。

执行与评分也分开：Agent 开发时限制网络访问；提交后，将补丁放进干净容器重新测试，避免运行时修改的测试、依赖或其他环境状态被误当作修复成果。最终发布 642 道 V2 任务及固定的执行、评分协议。

**主要结论：** 可靠分数需要同时保证题目正确、测试正确和评分环境干净。修订后部分强系统已接近满分，论文另提供较难子集。比较新旧版本时应同时报告任务版本与执行预算。

SWE-Bench Pro is a widely used benchmark of long-horizon software engineering tasks for coding agents. As agents improve, they reach task issues earlier agents never touched and interact with the evaluation environment in ways the original harness did not anticipate. We present **SWE-Bench Pro V2**, a revised public split built to keep the benchmark accurate as capabilities advance. **Agentic audits, expert adjudication and blind re-implementation** repaired or retired 480 of the 731 tasks: 23 contracted engineers spent 404 hours, each working in a language they write professionally, and every revised instruction was verified by a second engineer solving the task from the text alone. A hardened protocol restricts network access to the model endpoint and re-grades every patch in a clean container, so agents cannot retrieve upstream fixes or get credit for changes outside their patch. On the 642 V2 tasks frontier agents resolve up to 99.4% while other systems stay clearly separated, and a 51-task Hard split spreads systems from 52.9% to 98.0%. We release the benchmark and distill lessons for maintaining agent benchmarks over time.

<a id="paper-2605-03546"></a>

### 2.4 ProgramBench

[论文](https://arxiv.org/abs/2605.03546) · [代码](https://github.com/facebookresearch/ProgramBench)

**主张与研究方法：** ProgramBench 要求 Agent 从空目录重建一个软件。输入包括可运行的参考程序和文档，Agent 可以向参考程序输入数据、观察输出，再设计并实现自己的代码库；参考程序的源代码不作为输入。

最终用行为测试比较新实现与参考程序：相同输入下，输出和行为是否兼容。测试通过自动探索不同输入生成，不强制 Agent 采用参考程序的内部架构。200 个任务既有小型命令行工具，也有 SQLite、FFmpeg 等大型软件。

**主要结论：** 该任务同时考察需求探索、架构设计、实现和验证。原论文评估的模型尚未完整解决任何任务，部分测试通过率可以反映实现进展；生成代码还容易集中成单文件。通过已有测试表示覆盖到的行为兼容，不能保证完整实现了参考软件。

Turning ideas into full software projects from scratch has become a popular use case for language models. Agents are being deployed to seed, maintain, and grow codebases over extended periods with minimal human oversight. Such settings require models to make high-level software architecture decisions. However, existing benchmarks measure focused, limited tasks such as fixing a single bug or developing a single, specified feature. We therefore introduce **ProgramBench** to measure the ability of software engineering agents to develop software holisitically. **In ProgramBench, given only a program and its documentation, agents must architect and implement a codebase that matches the reference executable's behavior.** End-to-end behavioral tests are generated via agent-driven fuzzing, enabling evaluation without prescribing implementation structure. Our 200 tasks range from compact CLI tools to widely used software such as FFmpeg, SQLite, and the PHP interpreter. We evaluate 9 LMs and find that none fully resolve any task, with the best model passing 95\% of tests on only 3\% of tasks. Models favor monolithic, single-file implementations that diverge sharply from human-written code.

<a id="paper-2611-08417"></a>

### 2.5 Terminal-Bench 2.1

[论文](https://arxiv.org/abs/2611.08417) · [项目](https://www.tbench.ai/) · [Terminal-Bench 原论文](https://arxiv.org/abs/2601.11868)

**主张与研究方法：** Terminal-Bench 的每道题包含一个可运行环境、一段任务要求，以及检查最终结果的测试。Agent 在终端中操作环境，完成编程、配置或数据处理等工作。

2.1 的维护论文研究这些题目如何持续保持有效。作者结合社区反馈、Agent 执行日志、参考解和自动检查寻找缺陷，经人工确认后修订指令、环境、测试及资源配置，再重跑评测。一个典型问题是：Agent 已用另一种正确方法完成任务，测试却只接受原先预想的实现方式。

**主要结论：** 修复题目和测试会改变分数及相近系统的排名。时间预算也会改变结论：在部分实测组合中，给更多时间后，原先很大的 harness 差距明显缩小。因此任务版本、验证器和执行预算都属于评测设置。

AI agents may soon become capable of autonomously completing valuable, long-horizon tasks in diverse domains. Current benchmarks either do not measure real-world tasks, or are not sufficiently difficult to meaningfully measure frontier models. To this end, we present Terminal-Bench 2.0: a carefully curated hard benchmark composed of 89 tasks in **computer terminal environments inspired by problems from real workflows**. Each task features a unique environment, human-written solution, and comprehensive tests for verification. We show that frontier models and agents score less than 65\% on the benchmark and conduct an error analysis to identify areas for model and agent improvement. We publish the dataset and evaluation harness to assist developers and researchers in future work at [this https URL](https://www.tbench.ai/) .

Coding agents are among the most economically consequential deployments of LLMs to date, making reliable evaluation increasingly important. Yet even benchmarks that are carefully validated at release can become stale. As models improve, they can discover valid solutions that existing verifiers reject, while changes to evaluation infrastructure can invalidate assumptions embedded in tasks and tests. We call the resulting accumulation of defects **benchmark maintenance debt**: a growing gap between benchmark scores and the capabilities they are intended to measure. We introduce a continuous-validation workflow for agentic benchmarks that combines **community reports, task artifacts, agent traces, automated oracle checks, and human-gated repairs**. We apply this workflow to Terminal-Bench 2.0, a benchmark that underwent extensive human and LM-assisted review and red-teaming before release. Our audit identifies issues in roughly 30% of the benchmark, and we release the resulting repairs as Terminal-Bench 2.1. These repairs change evaluation results: accuracy increased by over 10 percentage points and leaderboard positions move by up to three ranks, even as the overall ranking remains highly correlated (Spearman rho = 0.958).  
We evaluate how resource allocation shapes benchmark conclusions. We show that **fixed wall-clock can materially change agent performance**: For example, extending the time limit closes a 20pp harness gap on GPT 5.4 and shrinks a 30 pp gap on GPT 5.4 mini to 5 pp. Benchmark maintenance is therefore not only about repairing task artifacts: resource budgets are part of the measurement specification and must be validated alongside the tasks themselves.  
More broadly, benchmark maintenance debt is not just accumulated implementation bugs: our results show that as models improve, both evaluation assumptions and resource settings may need to be revalidated.

<a id="paper-2409-11363"></a>

### 2.6 CORE-Bench

[论文](https://arxiv.org/abs/2409.11363) · [代码与任务](https://github.com/siegelz/core-bench)

**主张与研究方法：** CORE-Bench 检查 Agent 能否利用论文已有的代码和数据复现计算结果。Agent 需要理解运行说明、配置环境、执行程序，找到结果并回答相关问题；某些题目还需要读取图像或图表。

同一论文派生不同难度的任务，改变提供的准备程度和 Agent 需要自行完成的工作。评测器将回答与参考结果比较。数据包含 90 篇论文的 270 个任务，覆盖计算机、社会科学和医学。

**主要结论：** 有代码和数据仍不等于能顺利复现，环境配置、执行与结果理解都可能失败。原文比较 AutoGPT 和专用 CORE-Agent，模型为 GPT-4o、GPT-4o-mini；最难设置仍有较大改进空间。它评测已有工作的计算复现，不要求 Agent 独立提出新的科学发现。

AI agents have the potential to aid users on a variety of consequential tasks, including conducting scientific research. To spur the development of useful agents, we need benchmarks that are challenging, but more crucially, directly correspond to real-world tasks of interest. This paper introduces such a benchmark, designed to measure the accuracy of AI agents in tackling a crucial yet surprisingly challenging aspect of scientific research: **computational reproducibility**. This task, fundamental to the **scientific process**, involves **reproducing the results of a study using the provided code and data**. We introduce CORE-Bench (Computational Reproducibility Agent Benchmark), a benchmark consisting of 270 tasks based on 90 scientific papers across three disciplines (computer science, social science, and medicine). Tasks in CORE-Bench consist of three difficulty levels and include both language-only and vision-language tasks. We provide an evaluation system to measure the accuracy of agents in a fast and parallelizable way, saving days of evaluation time for each run compared to a sequential implementation. We evaluated two baseline agents: the general-purpose AutoGPT and a task-specific agent called CORE-Agent. We tested both variants using two underlying language models: GPT-4o and GPT-4o-mini. The best agent achieved an accuracy of 21% on the hardest task, showing the vast scope for improvement in automating routine scientific tasks. Having agents that can reproduce existing work is a necessary step towards building agents that can conduct novel research and could verify and improve the performance of other research agents. We hope that CORE-Bench can improve the state of reproducibility and spur the development of future research agents.

<a id="paper-2609-04298"></a>

### 2.7 Harbor Adapters

[论文](https://arxiv.org/abs/2609.04298) · [适配器代码](https://github.com/harbor-framework/adapters)

**主张与研究方法：** 不同 Agent benchmark 各有任务格式、启动方式和评分程序，接入新 Agent 往往需要重复适配。Harbor Adapters 将这些差异转换成统一的任务封装：告诉 Agent 做什么、怎样启动环境，以及最终怎样验收。

转换后还要做一致性验证：用相同模型和 Agent 分别运行原始评测程序与 Harbor 适配版本，检查迁移是否改变结果。作者在适配套件上进行跨模型、跨 harness 评测，并从中筛出小而多样的 Harbor-Index，降低大规模评测的成本。

**主要结论：** 统一格式可以减少接入工作，但适配本身可能改变工具、环境和评分条件，需要核对迁移前后的结果。文中的 CooperBench 检查仅覆盖 50 个任务对，使用 OpenHands SDK 与 Gemini 3 Flash；不能将它理解为 CooperBench 已进入全部大规模主实验。

Evaluating agents on the growing number of agentic benchmarks is challenging because they often require complex environments and agent integrations. We introduce **Harbor Adapters, a unified evaluation infrastructure for agentic benchmarks**. Our work makes three contributions. First, we develop benchmark adapters that port more than 80 benchmarks to evaluate arbitrary agents, and validate them through rigorous code review and parity experiments. Second, we conduct a large-scale evaluation of 8 models spanning capability tiers across 54 benchmarks; every model is run with Terminus-2 and with one of 3 native harnesses. This enables a broader analysis of agent capabilities and failure modes than was previously possible. Third, we introduce Harbor-Index, a curated set of 82 difficult, diverse, and high-quality tasks spanning 29 benchmarks, refined from the adapted suite through difficulty filtering, AI and human audit, and an audit-and-fix loop. Harbor-Index preserves the challenge and breadth of large-scale agentic evaluations while being affordable to run; no evaluated model-harness configuration exceeds 30% pass rate, and the strongest (GPT-5.5 with Codex) reaches 28.0%. We release the adapters, evaluation results, in-depth analysis, and Harbor-Index as open-source artifacts to support more reliable and comprehensive evaluation of language-model agents.

<a id="paper-2609-34683"></a>

### 2.8 AgentPerfBench

[论文](https://arxiv.org/abs/2609.34683) · [公开数据](https://huggingface.co/datasets/agent-perf-bench/AgentPerfBench)

**主张与研究方法：** Agent 多轮执行时，下一次请求通常包含上一次的大部分上下文。只生成一批互不相关的随机 prompt，无法反映这种共享历史对缓存和显存的影响。AgentPerfBench 收集 SWE-bench、Terminal-Bench、OSWorld 与聊天任务的请求轨迹，并提供两种服务负载：直接回放录制请求，或按真实轨迹的分布和前缀结构生成合成请求。

压测时，一个会话内部按顺序推进请求，同时改变共享模型端点上的并发会话数。测量首 token 等待、后续输出间隔、吞吐和缓存占用，再结合 GPU 算子分析判断受计算、访存还是 KV 容量限制。合成负载还要与真实回放对比，检查是否保留关键性能特征。

**主要结论：** 输入输出长度相近的两组负载，可能因为前缀共享和上下文增长方式不同而表现不同。论文在 vLLM 与 SGLang 上展示这种差异。回放使用预先记录的请求；服务输出不会驱动 Agent 重新规划，因此这里测得的是推理服务性能，不能直接推导完整任务成功率或协作能力。

The optimization of LLM serving engines, such as vLLM and SGLang, is largely benchmark-driven: optimizations, scheduling policies, hardware and system designs are all selected based on representative workloads. However, a significant mismatch has emerged in the agentic era. Existing benchmarks primarily focus on simple single-turn chatbot workloads. LLM applications are increasingly agentic: coding agents, terminal execution systems, and tool-use agents issue multi-turn requests with growing context lengths. We introduce **AgentPerfBench**, a benchmark suite for agentic inference. It uses real traces from agentic benchmarks, such as SWE-Bench and TerminalBench, alongside standard chat baselines. This enables benchmarking of models on multi-turn tasks involving tool calling, skill utilization, and increasing context lengths. AgentPerfBench also samples from empirical distributions of input length, output length, and turn count derived from the real traces, generating representative synthetic profiles for cheap and accurate measurements on new hardware. In addition, we further find that several existing benchmarks fail to accurately reflect real hardware performance for two key reasons: 1) they do not account for realistic context-length growth, and 2) they measure inference performance without operating at hardware saturation. We discuss these issues in detail and provide rich kernel-level Nsight Compute (NCU) traces to construct a new multi-dimensional roofline model that captures hardware-system limitations in both memory bandwidth and memory capacity footprint. The benchmarking suite then includes automated scripts to identify potential bottleneck conditions on emerging hardware when evaluated with diverse agentic traces. Together, these contributions quantify the chat-to-agentic gap in current inference benchmarks and characterise per-kernel GPU resource utilisation via roofline analysis.

<a id="paper-2512-08296"></a>

### 2.9 Capable language models can outgrow the benefits of collaboration

[论文](https://www.nature.com/articles/s42256-026-01268-y)

**主张与研究方法：** 论文问的是：给定一个任务和模型，额外增加 Agent 何时能提高完成质量？作者让同一任务分别由五种结构执行：一个 Agent 独立完成；多个 Agent 各自探索后汇总；负责人分工并审核；成员相互讨论后汇总；以及负责人和成员互相通信的混合结构。

比较时对齐任务要求、工具访问和整个系统的推理 token 预算上限。团队需要在成员之间分配总预算。最终仍按任务结果评分，例如代码补丁是否通过测试、网页问题是否回答正确。作者再从执行日志统计通信、额外轮次和错误传播，拟合模型预测组队的收益。独立并行组没有显式消息交换，但代码与终端任务的公开实现仍共享容器状态。

六个 benchmark 分别是 BrowseComp-Plus（网页检索）、Finance Agent（财务分析）、PlanCraft（约束下规划）、WorkBench（工作场景工具操作）、SWE-bench Verified（仓库修复）和 Terminal-Bench（终端任务）。260 个配置对应模型、组织方式与任务集的组合。

**主要结论：** 单 Agent 的已有表现是最稳健的协作收益预测因素；基线越强，额外协调越容易抵消组队收益。可分开调查再综合的任务与依赖严格先后顺序的任务表现不同。作者的选择规则在留出配置上有效，无法可靠预测全新任务域的绝对分数。SWE-bench Verified 和 Terminal-Bench 每个配置仅测 20 题，约 45% 的基线阈值属于经验规则。

Agents, language model-based systems that can reason, plan and act with tools to accomplish tasks, are widely deployed, **yet it remains unclear when multi-agent coordination outperforms a strong single agent**. Here we conduct a controlled experiment that holds task prompts, tools and compute budgets constant while varying only coordination structure and model capability. Across 260 configurations spanning six benchmarks, five architectures and three LLM families, we derive a predictive model using empirical coordination metrics. Across benchmarks, single-agent baseline performance emerges as the most robust predictor of whether coordination improves or decreases performance. In particular, we identify an empirical capability-saturation threshold beyond which additional agents are unlikely to improve performance. This threshold correctly predicts the effect of multi-agent coordination on performance in 94% of validation configurations on SWE-bench Verified and Terminal-Bench. We therefore interpret this threshold as a practical selection rule rather than a universal scaling principle. A second effect, baseline-scaled error amplification, survives cluster-robust inference ( $P_{robust}= 0.030$) and supports the failure-mode taxonomy. The fitted model achieves cross-validated $R_2 = 0.373$ (0.413 with a task-grounded capability metric) and selects the best architecture in 87% of held-out configurations. These results provide a quantitative framework for within-domain architecture selection and for estimating when multi-agent coordination is likely to improve performance or add overhead.

<a id="paper-2610-32131"></a>

### 2.10 Pairing Matters

[论文](https://arxiv.org/abs/2610.32131) · [实验记录与分析代码](https://github.com/lisazhao-gz/pairing-matters)

**主张与研究方法：** 同一个模型接入不同的运行框架，可能得到完全不同的工具说明、编辑方式、执行循环和错误反馈。Pairing Matters 固定模型服务与任务，系统地更换模型和 harness 的组合，检查效果来自哪个组合。

实验将 Qwen3-Coder-Next、Devstral-Small、GLM-4.7-Flash 与六种 harness 两两搭配，在相同的 100 个 SWE-bench Verified 任务上进行 1,800 次评分运行。vLLM 在单张 H100 NVL 上依次服务模型，harness 在独立 CPU 主机运行。作者记录最终补丁、失败轨迹和全部模型调用成本。

**主要结论：** 同一模型的解决率随 harness 改变，最大相差 44 个百分点，harness 的排名也会随模型变化。“每成功任务 token 成本”将成功和失败运行的消耗一起计入，再除以成功任务数，部分组合相差超过 20 倍。不同框架还有各自的执行限制与超时，因此这些差异对应论文的完整实测配置。

Self-hosting coding agents is often necessary for software-engineering teams that must keep proprietary code and development traces within controlled infrastructure. Lightweight, open-weight models make such deployment more feasible by reducing hardware requirements, while strong results on repository-level benchmarks demonstrate their potential for demanding coding tasks. Deploying these models as coding agents requires pairing them with an agent harness, making their joint performance a key deployment consideration. Yet existing leaderboards primarily report fixed harness-model configurations rather than controlled comparisons across alternative pairings. To address this gap, we investigate **harness-model interactions** through a controlled full-factorial evaluation of six open-source harnesses and three lightweight coding models across 100 SWE-bench Verified tasks, producing 1,800 graded runs under common serving, metering, and grading conditions. For the same model, resolution rates differ by up to 44 percentage points across harnesses, while harness rankings change across models. We apply an evidence-based failure taxonomy to 1,100 unsuccessful runs and find substantial differences in failure patterns across harness-model pairings. A model's dominant failure modes under one harness need not dominate under another. Efficiency is similarly dependent on the pairing: even among model-directed loop harnesses, charged tokens per resolved task vary by more than 20-fold. These findings make harness-model selection a central deployment decision for lightweight coding agents. Strong performance with one harness or model does not guarantee similar results with another. We translate these findings into practitioner guidance for pairing selection, token-efficiency assessment, and trajectory-informed harness engineering, and release the complete experimental records and analysis artifacts.

<a id="paper-2610-17471"></a>

### 2.11 Scaling Inference-Time Compute with Teams of Coding Agents

[论文](https://arxiv.org/abs/2610.17471)

**主张与研究方法：** 论文研究编码任务中的 worker 应该用在哪个阶段，以及增加成员的收益能否覆盖费用。作者在同一个轻量运行框架里设置负责人和 worker，分别比较单 Agent、等待 worker 返回后继续、委派后继续工作的同步／异步团队，以及不同强弱模型的组合。

负责人可以把规划、实现、验证交给 worker。例如只让 worker 提建议，代码仍由负责人完成；或让 worker 直接实现部分模块；或让它独立检查结果。实验逐项改变委派阶段、worker 数量与模型配置，分别记录任务分数、推理费用和完整耗时。

主任务是 ProgramBench 的程序重建，另用 Commit0-Lite 检查从库骨架与测试实现 Python 库时的变化。作者比较不同预算下能达到的质量，避免仅凭增加成员后的最高分判断团队是否划算。

**主要结论：** 在 ProgramBench 的一组同构对照中，仅委派规划能以较低费用获得接近全阶段委派的分数；Commit0-Lite 的阶段收益不同，因此“只委派规划最好”不能推广到所有编码任务。异步允许负责人继续工作，也可能让其在关键结果返回前就作出决定。

Multi-agent systems promise a new axis for scaling inference: rather than having one agent think longer or sample more attempts, a task is split across many agents that work in parallel and coordinate. However, in practice, more agents can easily produce duplicate work, coordination failures, and higher costs. We therefore formulate team design as a compute allocation problem: starting from a solo agent, where should additional inference compute go to reach **the reward-cost Pareto frontier**? We build a minimal multi-agent harness from the ground up and trace this frontier by varying, one at a time, the workflow stage at which a lead delegates to its workers (planning, implementation, or verification), the models that form the team, and the number of workers. On ProgramBench, teams outperform solo agents but cost three to seven times as much. With the right compute allocation, however, a heterogeneous 17-agent team comes within 1.4 points of a strong homogeneous 5-agent team at 70% lower cost. This efficiency stems from three findings. First, **planning is the most valuable use of workers**: in a homogeneous team whose lead decides how many workers to spawn, a lead that delegates only planning to its workers, and then implements and verifies the code itself, matches the reward of a lead that delegates to workers throughout planning, implementation, and verification, at half the cost. Second, **cheap models pay off as planners but not as implementers**: a strong lead with cheap planners recovers 47.5% of the reward gain of an all-strong team for only 13.9% of its additional cost, whereas cheap implementers lower reward. Third, **planners keep improving reward as the team grows, whereas implementers and verifiers plateau beyond four workers**. Together, our results offer a guide to spending an agent budget where it counts, given the task, cost, and latency constraints a user has.

<a id="paper-acl26-maseval"></a>

### 2.12 MASEval

[论文](https://aclanthology.org/2026.acl-demo.34/) · [代码](https://github.com/maseval/MASEval)

**主张与研究方法：** 多 Agent 的表现同时受模型、编排框架、工具和错误处理影响。MASEval 将“完成任务的整个系统”作为评测对象，让研究者可以固定任务、分别更换这些组成部分。

它把任务要求、环境与工具、待测 Agent 系统、评分程序分开。框架适配器负责启动系统并取得各 Agent 的消息；benchmark 适配器负责加载任务、准备环境并按原规则评分。执行时记录模型调用、工具操作和各成员消息，便于检查错误发生在哪里。这样，同一个 Agent 系统可以接入多个 benchmark，同一个任务也能比较不同编排框架。

**主要结论：** 作者在 MACS、ConVerse 和 MultiAgentBench 的选定场景中，比较 smolagents、LangGraph、LlamaIndex，使用 GPT-5-mini、Gemini-3.0-Flash、Claude-Haiku-4.5。相近能力与费用档位内，框架选择也会明显改变结果。它提供跨框架评测接口，具体任务仍由接入的 benchmark 定义；支持某个适配器不等于论文已在该基准全部场景完成复现。

The rapid adoption of LLM-based agentic systems has produced a rich ecosystem of frameworks (smolagents, LangGraph, AutoGen, CAMEL, LlamaIndex, i.a.). Yet many existing benchmarks are model-centric: they fix the agentic setup and do not compare other **system components**. We argue that implementation decisions substantially impact performance, including choices such as topology, orchestration logic, and error handling. **MASEva**l addresses this evaluation gap with a Python library that treats the entire agentic system as the unit of analysis. Important design decisions such as harness and context engineering are first-class citizens. MASEval helps practitioners identify the best implementation for their use case and researchers systematically study agentic systems, opening new avenues for principled system design. Through the first systematic system-level comparison across 3 benchmarks, 3 models, and 3 frameworks, we find that, across models of comparable cost and capability, framework choice matters as much as model choice. MASEval is available under the MIT licence at [https://github.com/maseval/MASEval](https://github.com/maseval/MASEval).
<a id="paper-2605-08647"></a>

### 2.13 AgentCollabBench

[论文](https://arxiv.org/abs/2605.08647v1) · [评测框架](https://github.com/aritra741/AgentCollabBench) · [数据](https://huggingface.co/datasets/AgentCollabBench/AgentCollabBench)

**主张与研究方法：** 给定一个结构化任务，测试框架创建 2–6 个角色，并按指定图和发言顺序交付消息。900 个经人工校验的情景覆盖软件工程、DevOps 和数据工程。每条轨迹只考察预先定义的干预，比如在上游消息中加入必须保留的标记，逐跳核对它能否到达下游。其余测试分别记录硬约束丢失、错误事实传播和跨任务信息泄漏。标记和跨任务隔离用程序判定，硬约束及错误事实两项用独立评审模型 DeepSeek V4 Flash 打分。

**主要结论：** 汇合节点可能忽略只由一条分支携带的信息。这个失效点在逐跳记录中可见，但格式正确的最终产物可能把它掩盖。论文比较 GPT-4.1 mini、Gemini 2.5 Flash Lite、Qwen3.5-35B-A3B 和 Llama 3.1 8B Instruct，后两者经 OpenRouter 调用。实验属于受控消息交互，原文未披露底层推理引擎和硬件。结果解释消息传递的行为，仓库改动、工具运行和真实任务耗时需要另行测量。

Multi-agent systems achieve state-of-the-art outcomes through peer collaboration. However, when an agent in the pipeline silently **drops a constraint**, the system's final output may look correct even though the reasoning chain was quietly corrupted, and existing outcome-based evaluations are blind to such multi-hop process failures. To make these vulnerabilities measurable before deployment, we introduce **AgentCollabBench**, a diagnostic benchmark of 900 human-validated tasks spanning software engineering, DevOps, and data engineering. Each task isolates one of four behavioral risks: **instruction decay** (does a constraint survive peer pressure?), **false-belief contagion** (does a falsehood spread through consensus?), **context leakage** (does information bleed between tasks?), and **tracer durability** (does marked data reach the final agent?). Evaluating four modern LLMs (GPT 4.1 mini, Gemini 2.5 Flash Lite, Qwen-3.5-35B-A3B, and Llama 3.1 8B Instruct), we expose model-specific vulnerability profiles invisible to outcome-only evaluation; Qwen-3.5-35B-A3B, for example, leads on tracer durability and instruction stability, while GPT 4.1 mini leads on leakage containment and false-belief resistance. Beyond per-model differences, communication topology emerges as a primary risk factor that explains 7-40% of the variance in multi-hop information survival. The effect traces to a synthesis bottleneck specific to converging-DAG nodes: an agent weighing competing parent inputs discards constraints carried by a minority branch, a bottleneck structurally absent from linear chains. AgentCollabBench demonstrates that suboptimal topology can silently erase the safeguards of highly capable models, arguing that multi-agent reliability is fundamentally a structural problem and that scaling model intelligence alone is no substitute for architecture.
<a id="topic-sharing"></a>

## 3. Knowledge Sharing and Reuse

<a id="paper-2610-06481"></a>

### 3.1 AECP

[论文](https://arxiv.org/abs/2610.06481)

**主张与研究方法：** 多个编码 Agent 分工后，A 告诉 B 的发现可能被忘记，承诺好的接口也可能在实现中发生变化。AECP 让 harness（负责执行工具和管理工作区的运行框架）承担知识投递、接口检查和变更通知。负责人先划分模块和依赖，各 worker 再并行开发；成员之间通过两类有固定字段的记录交换信息。

1. **知识产物：在需要使用时送达发现。** Worker 保存一条发现，并注明它适用于哪个函数、文件或目录。其他 worker 访问相关代码时，harness 将匹配的发现一起放进工具返回结果。可选的检查脚本用于验证这条发现，并标明已检查或未检查；后来被检查推翻的发现停止投递。
2. **契约产物：保存模块接口的承诺。** 模块负责人提前声明函数名、参数、返回结构等。Harness 生成接口桩，即可以导入、但尚未实现真实功能的占位代码，让依赖方先按约定开发。负责人提交真实实现时，框架检查能从代码中静态判断的接口不匹配，发现明确偏差就退回。
3. **处理接口变更。** 依赖方登记自己使用的接口。接口改版后，框架标记受影响的 worker，要求其读取新约定、重新登记依赖后才能完成任务；调用代码如何修改仍由 worker 负责。

例如，A 负责用户查询，B 负责报表。A 记录“用户不存在时 get_user 返回 None”，并关联该函数；B 读取它时收到提醒。A 又提前承诺 get_user(user_id) 的调用形式，B 就能先写调用代码。框架能检查接口是否兑现，函数的业务逻辑仍需测试验证。

**主要结论：** 在 Doc2Repo、NL2Repo、CodeProjectEval 的从规格生成仓库任务中，作者报告相比自由消息团队提高测试通过率、缩短完整任务时间。最直接的对照使用相同计划、分工和共享工作区，改变通信协议及框架动作。与隔离工作区、集中合并的团队相比，还同时改变了工作区与集成方式。方法基于 AWS Strands，另有 mini-SWE-agent 复核；相对单 Agent，输出 token 成本可能更高。

As AI agents increasingly tackle complex repository-level coding tasks, distributing work across multiple agents is a natural way to scale beyond the capabilities of a single agent. To coordinate their interdependent work, these agents share findings and agree on interfaces between modules. However, **exchanged information often serves only as context**, leaving individual agents to interpret it and incorporate it into subsequent work. Consequently, **shared findings may go unused and deviations from interface agreements may go undetected**, undermining the reliability and efficiency of collaboration. This motivates moving part of the coordination responsibility from individual agents to the **execution harness**. To make shared information actionable during execution, we introduce the **Artifact-Exclusive Communication Protocol (AECP)**. AECP requires agents to communicate exclusively through structured artifacts and specifies how the harness processes them. The harness supplies findings when agents access relevant code, screens implementations for mismatches with recorded interface commitments, and requires affected agents to revisit revised agreements. These coordination steps become part of harness execution rather than actions that agents must initiate from prior messages. Across Doc2Repo, NL2Repo, and CodeProjectEval, using closed- and open-source models including Opus-4.8 and DeepSeek-V4-Flash, AECP improves average test pass rate by 28.2% and reduces average wall time by 16.5% relative to an agent team using free-form inter-agent messages. Artifact-exclusive communication also blocks the relay of malicious instructions between agents, reducing how often they reach other agents from 95% to 0% and how often those agents act on them from 40% to 0%.

<a id="paper-2602-05965"></a>

### 3.2 Learning to Share

[论文](https://arxiv.org/abs/2602.05965) · [会议](https://proceedings.mlr.press/v306/fioresi26a.html) · [代码](https://github.com/UCF-CRCV/autogen-lts) · [控制器权重](https://huggingface.co/jfioresi/lts-decision-transformer)

**主张与研究方法：** 多个团队对同一道题并行探索，可能重复搜索网页、解析文件和计算答案。Learning to Share（LTS）给这些团队一个任务内共享记忆库，并训练小控制器决定哪些中间结果值得存入。主设置为三个 Magentic-One 式团队，各队仍有自己的负责人和执行 Agent。

执行过程是：某个 Agent 完成一步 → 额外生成该步的短摘要 → 控制器根据任务、已有记忆和当前步骤决定是否写入 → 其他团队的负责人看到新摘要，按需读取对应的完整输出 → 继续执行。只有被选中的完整输出进入接收方上下文，最终由原有汇总器整合各队答案。

控制器用 Qwen3-0.6B 实现，只训练其 LoRA 适配器和输入投影，任务 Agent 保持不变。训练奖励同时考虑任务结果、记忆后来是否被使用，并惩罚过多写入。例如，一队已经解析出网页表格，另一队可以读取该结果，省去重复访问与解析。

**主要结论：** AssistantBench、GAIA 上的实测显示，筛选共享结果能减少重复执行，并在部分设置中兼顾质量和完整任务时间。全部写入也可能更快，但会增加干扰；摘要生成和控制器推理本身有开销。记忆只在当前任务内共享，论文没有提供删除或修订旧条目的机制。

任务模型为 GPT-5.1 或 Qwen3-32B；控制器在 AssistantBench 的 33 道开发题上训练。实现基于 AutoGen／Magentic-One，代码与控制器权重公开。

Agentic systems solve complex tasks by coordinating multiple agents that iteratively reason, invoke tools, and exchange intermediate results. To improve robustness and solution quality, recent approaches deploy multiple agent teams running in parallel to explore diverse reasoning trajectories. However, parallel execution comes at a significant **computational cost**: when different teams independently reason about similar sub-problems or execute analogous steps, they repeatedly perform substantial overlapping computation. To address these limitations, in this paper, we propose **Learning to Share (LTS), a learned shared-memory mechanism for parallel agentic frameworks that enables selective cross-team information reuse while controlling context growth**. LTS introduces a **global memory bank** accessible to all teams and a **lightweight controller** that decides whether intermediate agent steps should be added to memory or not. The controller is trained using stepwise reinforcement learning with **usage-aware credit assignment**, allowing it to identify information that is globally useful across parallel executions. Experiments on the AssistantBench and GAIA benchmarks show that LTS significantly reduces overall runtime while matching or improving task performance compared to memory-free parallel baselines, demonstrating that learned memory admission is an effective strategy for improving the efficiency of parallel agentic systems. Project page: [this https URL](https://joefioresi718.github.io/LTS_webpage/)

<a id="paper-2609-09233"></a>

### 3.3 Subagents vs Agent Skills

[论文](https://arxiv.org/abs/2609.09233)

**主张与研究方法：** Skills是一组完成特定工作的说明、脚本和资源。同一个Skill有两种执行方法：主 Agent 把说明加载到自己的上下文并执行；或把工作交给独立上下文中的子 Agent，只接收它的最终结果。后者可以隔离中间操作记录，但父 Agent 必须把任务交代清楚。

作者强调技能描述需要写清三件事：适合解决什么子任务、调用时必须提供哪些输入、完成后应该返回什么。技能包内部的步骤也要足以完成这一承诺。例如，将子任务写成“处理这个表格，返回输出文件路径和统计结果”；子 Agent 可以独立处理，主 Agent 无需保留每一步调试记录。

实验在 SkillsBench 上固定技能包，比较两种执行位置；再换成从成功轨迹提炼、带明确输入输出要求的过程型技能包，重复比较。作者还加入无关技能描述增加上下文干扰，记录成功率、峰值上下文和总 token。合成技能包的比较限于成功构造出包的 64 道题。

**主要结论：** 原人工技能包下，子 Agent 未稳定胜出；换成过程清楚、接口明确的包后，子 Agent 更有优势。隔离执行需要额外调用和交接，总 token 通常增加。两套包同时改变了内容与步骤说明，跨包差异不能只归因于接口格式。实验使用修改后的 OpenHands SDK 和 Docker；开放模型由 vLLM 服务。

How can language model agents effectively leverage libraries of reusable knowledge to solve long-horizon tasks? Recent work has increasingly focused on agent skills: reusable capabilities represented as skill packages, i.e., multi-file bundles containing instructions, scripts, and other resources that help agents perform specific tasks. Agent skills are typically executed by loading their skill instructions into an agent's context and relying on the agent to follow them. As task horizons grow, however, this approach becomes increasingly brittle, because reasoning quality degrades as more information accumulates in the context window. We investigate an alternative approach in which **skill packages are instead invoked as subagents**. Rather than loading skill instructions into the main context, subagent execution spawns fresh context windows dedicated to solving individual subtasks. We show that subagent execution outperforms agent-skill execution when skill packages expose clear input-output contracts and their instructions encode the procedural knowledge needed to fulfill those contracts. The tradeoff is **additional communication overhead**, as extra tokens are required to coordinate between the main agent and its subagents. Our results show that the benefit of reusable knowledge depends not only on its content, but also on how it is organized and invoked.

<a id="paper-2609-32965"></a>

### 3.4 Relic

[论文](https://arxiv.org/abs/2609.32965v2) · [完整论文与附录 K](https://www.hongyidu.ai/relic/en/paper)

**主张与研究方法：** Relic 研究团队怎样把反复遇到的协作问题变成后续工作会执行的规则。它将成员私有记忆、共享代码与消息、团队协议分开保存。协议随角色保留，成员离开后，新成员仍受同一规则约束。

一次规则形成经过：从工作失败中提取证据 → 提议规则 → 检查证据及系统能否执行 → 审批采纳 → 把规则绑定到调度和工作检查中。规则明确何时触发、谁负责、需要哪些步骤与证据、未满足时怎样处理；后续可以修订或停用。

例如原文的接口审查规则要求作者和审查者对照接口说明、测试证据检查修改。规则既能提高审查工作的调度优先级，也能让执行检查拒绝尚未准备好的工作。生成代码和消息仍调用 LLM，日常动作选择由固定的结构化决策层按当前工作与规则评分完成。

**主要结论：** 方法的学习对象是持续保存、可修改的团队规则，模型参数和执行检查代码保持固定。作者通过只提供规则文本、增加运行时约束，以及更换成员等对照，检查规则是否真正影响后续工作。CooperBench 的全量比较混合了已发布参考结果，应重点结合其同模型子集阅读；不能把全部分数差异单独归因于规则机制。

Multiple agents may often conflict in an organization: for example, one coding agent changes an interface in a repository, but another continues to develop on the old version where existing tests become stale. A conversation can resolve the episode, but when the participants change, what makes the lesson continue to govern the team? We introduce **Relic, which turns recurring collaboration failures into organization-owned, executable protocols.** Members reflect on visible work, propose rules, and govern their adoption. **Adopted protocols bind triggers, responsibilities, required evidence, and execution consequences to the runtime, while remaining open to revision and retirement.** In one traced case, repeated integration friction produces an interface-review rule that governs later pull requests and is revised as work continues. Across 360 controlled runs over ten software workloads and three models, Relic raises complete-contract delivery from 14.06% to 19.76% (+5.71 percentage points) over a matched structured team without the protocol lifecycle, improving all four verified production endpoints in every model stratum. Under fresh-member transfer, behavioral correctness is 25.4% with no inherited protocol, 34.6% with the same rules provided as readable text, and 41.2% with executable bindings, a +6.5-point advantage over text alone. On the full CooperBench benchmark, after excluding 183 broken benchmark pairs, Relic achieves 371/469 (79.1%), establishing the best reported result among peer-structured systems. On the 47-pair same-model subset, Relic also exceeds Solo (28/47 vs. 26/47), reversing the coordination loss exhibited by the official peer baseline. Together, these results show how collaboration experience can become persistent organizational state that remains useful beyond the members who created it.

<a id="topic-serving"></a>

## 4. Orchestration, Scheduling and KV

<a id="paper-2405-19888"></a>
### 4.1 Parrot

[论文](https://www.usenix.org/conference/osdi24/presentation/lin-chaofan) · [代码](https://github.com/microsoft/ParrotServe)

**主张与研究方法：** 普通模型服务接口收到一批 prompt，却很难知道“这次生成的结果会被谁使用、哪些调用属于同一任务”。Parrot 让应用用 Semantic Variable（语义变量）标记这些输入和输出，显式告诉服务端调用之间的数据依赖。

比如架构师先生成接口说明 S，两个程序员都读取 S，各写一个模块，最后审查者读取两份代码。应用提交的是带变量引用的调用关系。S 生成后，服务端知道两个程序员可以启动；审查者需要等到两份代码都已交付。

服务端据此安排请求先后、批处理和缓存：将应用的完成时间或吞吐目标传递给相关调用；让读取同一段内容的调用尽可能复用共同前缀的 KV。论文还实现了面向共享前缀的 attention 路径。复用需要实际满足前缀等条件，引用相同变量本身并不自动消除所有计算。

**主要结论：** 应用暴露数据依赖后，服务端可以联合优化多个调用。在 MetaGPT 式编码工作流上的实测同时减少执行时间和 KV 内存开销；实验采用 LLaMA 13B 与单张 A100。该组结果主要证明服务效率，没有通过现代仓库修复验收来证明代码质量提高。

The rise of large language models (LLMs) has enabled LLM-based applications (a.k.a. AI agents or co-pilots), a new software paradigm that combines the strength of LLM and conventional software. Diverse LLM applications from different tenants could design complex workflows using multiple LLM requests to accomplish one task. However, they have to use the over-simplified request-level API provided by today's public LLM services, losing essential application-level information. Public LLM services have to blindly optimize individual LLM requests, leading to sub-optimal end-to-end performance of LLM applications.

This paper introduces **Parrot**, an LLM service system that focuses on the end-to-end experience of LLM-based applications. Parrot proposes **Semantic Variable**, a unified abstraction to expose application-level knowledge to public LLM services. A Semantic Variable **annotates an input/output variable in the prompt of a request, and creates the data pipeline when connecting multiple LLM requests**, providing a natural way to program LLM applications. Exposing Semantic Variables to the public LLM service allows it to perform conventional data flow analysis to uncover the correlation across multiple LLM requests. This correlation opens a brand-new optimization space for the end-to-end performance of LLM-based applications. Extensive evaluations demonstrate that Parrot can achieve up to an order-of-magnitude improvement for popular and practical use cases of LLM applications.

<a id="paper-2610-08647"></a>

### 4.2 SquidAgent
[论文](https://arxiv.org/html/2610.08647v1) · [代码](https://github.com/tmllab/2026_NeurIPS_SquidAgent)

**主张与研究方法：** 把工作交给并行子 Agent，会增加理解上下文、约定接口和整合结果的成本。SquidAgent 先估计这些成本，再决定哪些工作值得并行。

1. **规划工作和依赖。** 负责人生成子任务图，标明谁需要等待谁，并估计每项任务的输出长度及每层协调开销。没有依赖冲突的任务归为同一层。
2. **交付共同背景与约定。** Worker 继承负责人已有的规划上下文；开始并行前，负责人先写清命名、接口、格式和跨文件引用，减少各自做出不兼容的决定。
3. **逐层选择串并行。** 用输出 token 数近似主要生成成本：串行代价约为各任务长度之和，并行代价约为最长任务长度加协调开销。预计收益超过阈值才并行，否则由负责人顺序完成。

假设两项任务各预计生成 1,000 token，协调需要 100 token，成本比为 2000／1100≈1.82。论文主设置阈值为 1.9，因此这一层继续串行。这里估计的是耗时相关的最长路径，不能用它代表所有 worker 消耗的 token 总量。

**主要结论：** 在九个自建编码、技术写作与规划任务上，作者报告完整执行更快。方法依赖生成长度对时间有预测力；工具运行、排队与网络等待仍会改变实际收益。系统基于 Claude Agent SDK、执行模型为 Claude Sonnet 4.6，质量通过单独的任务条目评分评估。

LLM-based agents solve complex multi-step tasks, but sequential execution incurs substantial **latency**. In principle, parallelizing work across multiple agents should yield near-linear speedups. Yet existing parallel multi-agent systems often run slower than a single-agent baseline. We attribute this gap to two hidden costs that parallel execution incurs but a serial agent avoids. First, there is a **_re-exploration cost_**: redundant effort spent by parallel workers reconstructing context that the orchestrator already possesses, such as prior decisions, that would otherwise be inherited implicitly in a serial execution. Second, there is an **_alignment cost_**: the overhead required to reconcile inconsistencies across independently generated outputs. We thus derive a principled decision criterion: **a layer should be parallelized only when its critical-path cost, plus re-exploration and alignment overheads, is lower than the corresponding serial cost**. While this criterion is naturally expressed in wall-clock time, we observe that LLMs are poorly calibrated when asked to estimate task duration. To address this, we instead measure cost in predicted output tokens, which we empirically find LLMs can estimate substantially more reliably than wall-clock time. Building on this token-based criterion, we propose **SquidAgent. It estimates all token budgets in a single planning step, forks each worker directly from the orchestrator’s session to eliminate re-exploration cost, and replaces post-hoc reconciliation with a pre-generated shared convention block that converts alignment into a bounded upfront cost**. A deterministic scheduler then applies the criterion layer by layer. Empirically, SquidAgent achieves a 2.2× mean throughput improvement and a 2.6× mean wall-time speedup over Claude Code, and a 2.0× throughput improvement over the strongest multi-agent baseline.

<a id="paper-2602-01053"></a>

### 4.3 LRAgent

[论文](https://arxiv.org/html/2602.01053v2) · [会议](https://proceedings.mlr.press/v306/jeon26b.html) · [代码](https://github.com/hjeon2k/LRAgent)

**主张与研究方法：** 多 LoRA Agent 共用一个基础模型，再通过各自的小适配器形成角色差异。它们反复读取同一段历史时，完整 KV 既有共同部分，也有角色相关部分。LRAgent 将两部分拆开，减少每个角色各存一份完整缓存的开销。

LoRA 用两个小矩阵 A、B 表示权重增量。对隐藏状态 X，value 可写成 $XW₀＋(XA)B$——XW₀ 是基础投影，XA 是低维中间结果，乘 B 后得到角色增量。

1. **BaseShared。** 角色共同使用基础 value 缓存，分别保存自己的低维 XA。需要时再用各自的 B 恢复增量。它主要节省存储，角色仍要计算自己尚未处理的历史对应的低维缓存。
2. **BaseLRShared。** 进一步训练角色共用 A、各用自己的 B，使低维缓存也能共享。后继角色复用已有历史，只处理新追加的内容，进一步减少重复 prefill（生成回答前对输入的整段处理）。
3. **Flash-LoRA-Attention。** 通过改变矩阵乘法顺序，先对低维缓存做注意力加权，再乘 B 升维，避免先为全部历史展开高维角色缓存。论文主设置还共享 key 缓存。

**主要结论：** 拆分缓存可以比直接共享整份角色 KV 更好地保留任务质量，并减少显存与重复计算。不同角色的隐藏状态仍有差异，因此跨角色共享含近似；BaseLRShared 还需要共享 A 的适配器训练。准确率在 HotpotQA、ScienceQA 测量，主效率实验使用受控长度轨迹，另报告 HotpotQA 实际延迟。

实测基础模型为 LLaMA-3.1-8B-Instruct、Ministral-8B-Instruct；角色沿用 AutoAct 的规划、行动和反思，执行实现修改 FastChat／Transformers，硬件为 A6000 48GB。

Role specialization in multi-LLM agent systems is often realized via multi-LoRA, where agents share a pretrained backbone and differ only by lightweight adapters. Despite sharing base model weights, each agent independently builds and stores its own KV cache for the same long, tool-augmented trajectories, incurring substantial memory and compute overhead. Existing KV cache sharing methods largely overlook this multi-LoRA setting. We observe that, **cache differences across agents are dominated by adapter outputs, while activations from the shared pretrained backbone remain highly similar**. Based on this observation, we propose **LRAgent**, a KV cache sharing framework for multi-LoRA agents. It decomposes the cache into two components, **a shared base component** derived from pretrained weights and **an adapter-dependent component** derived from LoRA weights. LRAgent reduces memory overhead by sharing the base component across agents and storing the adapter component in its inherent low-rank form. It also reduces computational overhead by sharing the low-rank cache, enabled by a shared-A multi-LoRA architecture. This avoids redundant computations for contexts that have already been processed by other agents. To efficiently reconstruct adapter contributions at runtime, we introduce **Flash-LoRA-Attention**, a kernel that reorders attention computation to avoid materializing the low-rank cache to full dimension. LRAgent achieves throughput and time-to-first-token latency close to fully shared caching, while preserving accuracy near the non-shared caching baseline across agentic question-answering benchmarks. Code is available in the [official repository](https://github.com/hjeon2k/LRAgent).

<a id="paper-2609-34060"></a>

### 4.4 KVCMAS

[论文](https://arxiv.org/html/2609.34060) · [代码](https://github.com/hjeon2k/KVCMAS)

**主张与研究方法：** 同一模型切换角色提示后，即使后面的历史文字完全相同，也可能得到不同的 KV 缓存。KVCMAS 希望利用前一角色已经算好的缓存，估计“切换到下一角色需要改多少”，减少下一角色重新处理整段历史的工作。

1. **建立可复用的修正记录。** 当系统完整算过某段共享历史在不同角色下的 KV，就能记录参考缓存和角色之间的差值。方法保存一小组这样的参考样本，并用低秩矩阵压缩，减少存储与匹配开销。
2. **给新历史寻找相近参考。** 新的一次交接到来时，比较当前缓存与历史参考样本，按相似程度组合缓存差值，并进行位置对齐。可把它理解为“根据以前见过的角色切换，估计这次应怎样修补缓存”。
3. **判断是否值得复用。** 匹配可靠时，修正前一角色的 KV，交给下一角色使用；不可靠时，回退到正常 prefill，必要时用这次完整计算补充参考记录。修正后的缓存还能继续传给后续角色。

**主要结论：** 该方法节省的是共享历史的输入计算，缓存修正本身含近似，不能保证与完整计算逐项相等。作者分别在 MMLU、GSM8K、HumanEval、MathVista、Video-MME 上测任务质量，并用固定四 Agent 轨迹测并发服务效率。回放中的 TTFT（请求到首个输出 token 的等待时间）收益需要与实际任务通过率分别解读。

文本实验使用 Llama-3.1-8B-Instruct、Qwen2.5-Coder-7B-Instruct，视觉实验使用 LLaVA-OneVision-7B。并发回放使用 vLLM 与 A100 80GB，单流实验使用 A6000 48GB。

Prompt-specialized multi-agent systems enable multiple agents to share a model while performing complementary roles to solve complex tasks. However, **agent-specific prefixes change the KV cache generated for the same shared context**, causing each agent to repeatedly prefill the growing context and construct a separate cache with high computation and memory overhead. Selective recomputation reduces this redundancy but still retains substantial model execution, while existing delta correction methods either support only recurring context relations or maintain memory-intensive online correction states for dynamically changing context. For first seen shared context, these methods also construct a reference cache outside the agent workflow, and an approximate correction at the first agent affects the outputs passed to subsequent agents. We present **KVCMAS, an online KV cache correction framework that represents cross-agent cache deviations using compact low-rank states and seamlessly chains corrections along the agent workflow without an additional reference prefill**. This design supports dynamically changing shared context while preserving an exact first-agent cache. Across multiple language and vision-language workloads, KVCMAS matches or improves the accuracy of prior KV cache sharing methods while achieving the lowest TTFT under highly concurrent serving. Under controlled serving traces, it provides a 2.0× TTFT speedup over inference without KV cache sharing and reduces peak GPU memory by up to 3.7× relative to a prior KV cache correction method. These results establish KVCMAS as an accurate and scalable KV cache sharing approach for prompt-specialized multi-agent serving.

<a id="paper-2605-10913"></a>

### 4.5 Shepherd

[论文](https://arxiv.org/abs/2605.10913)

**主张与研究方法：** Shepherd 为 Agent 提供可观察、分叉、恢复和回放的执行记录。它同时管理 Agent 的对话状态与执行环境，使另一个监督 Agent 能观察正在做什么，也能从已有状态尝试另一条执行路径。

每次工具操作的意图与结果被记录为事件。监督者可以订阅事件流；需要分叉时，系统将 Agent 状态与沙箱环境一起复制到新分支，保留原分支，再从指定位置继续。这样可以局部重试或比较另一种操作，无需每次从任务起点重跑。外部不可逆副作用仍超出可恢复环境的保证。

在多 Agent 编码案例中，两个 worker 各做一项功能，监督者观察双方轨迹，并可采取三种动作：向某个 worker 注入指导；让落后方从领先方的状态分叉后重新接续；或终止卡住的 worker。前者用于轻量提醒，后两者改变实际执行状态。原文还展示了工作流局部重放优化与训练中的轨迹分叉。

**主要结论：** CooperBench 案例中，监督提高了普通双 Agent 的联合通过率，并增加一定监督耗时和模型费用。它说明运行框架能支持有效的实时干预，收益需要连同监督者成本评估。该案例 worker 为 Claude Haiku 4.5，监督者为 Sonnet 4.6 或 Opus 4.7；不能把监督案例视为整套框架唯一的技术贡献。

As LLM agent systems take on more complex tasks, they increasingly rely on meta-agents: higher-order agents that create, operate on and manage other agents. Meta-agent operations such as coordinating agents, halting risky actions before execution, or repairing failed runs, require runtime manipulation of agentic execution. Yet existing agentic substrates make this difficult: they expose only transcripts and environment snapshots, forcing meta-agents to build ad hoc tooling to reconstruct and operate over full execution state. Therefore, we introduce **Shepherd**, a Python substrate grounded in functional programming principles, where **an agent's execution is itself a first-class object that a meta-agent can easily inspect and transform**. Every model action, tool call, and environment change becomes a structured event in a reversible, Git-like execution trace, where any past state can be reverted 5x faster than docker commit and fork. Three example use cases show Shepherd's versatility: (1) a supervisor meta-agent prevents conflicts among parallel coding agents, lifting pair-coding pass rate from 28.8% to 54.7% on CooperBench; (2) a counterfactual optimization meta-agent repairs agent workflows by proposing edits and replaying runs from the point of changed behavior, outperforming MetaHarness on Terminal-Bench 2.0 by 12.8% with 58% lower wall-clock; (3) a training meta-agent picks fork points during rollouts to improve credit assignment in long-horizon agentic RL, doubling GRPO's uplift on Terminal-Bench 2.0. We open-source Shepherd to enable principled and efficient operations over agentic execution for both users and meta-agents.

<a id="paper-2609-38345"></a>

### 4.6 OpenCollab

[论文](https://arxiv.org/abs/2609.38345) · [代码](https://github.com/RISE-X-Lab/OpenCollab)

**主张与研究方法：** 多 Agent 系统写了几个角色，不代表运行中这些角色真的参与了工作。OpenCollab 把“怎样组织角色”与“怎样调用模型和工具”分开，让不同组织方式共用相同的执行底座，便于控制实验条件。

上层有两种控制方式：团队模式给定角色、工具权限和通信方向，由模型决定何时委派与交接；工作流模式则用程序规定调用顺序、分支和停止条件。底层统一管理每个角色的上下文、模型调用、工具执行与预算，在调用前检查权限和剩余资源。

每次调用、委派、拒绝、终止与文件变更都记录所属角色。Adherence（组织执行一致性）据此检查声明的组织是否实际发生：成员有没有参与、委派是否落实、信息是否按允许路径传递，以及预算和上下文规则是否遵守。

**主要结论：** 同模型、同任务和预算下，团队有时提高通过率，单 Agent 配置可能更省 token 和费用；结构被正确执行也不保证最终成功。论文在 SWE-Bench Pro、Terminal-Bench 2.1、DeepSWE 上给出对照。它主要提供组织方式的实现与审计框架，不能仅凭角色名称或一次结果推断协作机制有效。

Multi-agent coding systems are designed to tackle complex software engineering tasks through collaboration. However, existing evaluations typically assume configured organizations are followed faithfully, whereas reality differs. This behavioral gap, combined with differences in underlying system components, prevents clear attribution of observed gains. To this end, we introduce **OpenCollab**, a multi-agent coding framework that provides **a unified infrastructure for programmable collaboration and controllable runtime**. Specifically, OpenCollab **unifies organization design, enforces experimental control on a shared runtime, and tracks execution through fine-grained event streams**. On this basis, we define **Adherence** to quantify whether the declared organization is actually realized. Our experiments reveal that agents collaborate very differently across configurations: changing any single dimension shifts Adherence, from 47.2% to as high as 97.2%. Furthermore, extensive agentic coding benchmarks show that OpenCollab (Duo) establishes new SOTA performance compared to the mainstream harnesses such as Mini-SWE-agent, OpenHands, Codex CLI, and Claude Code, showing that a well-designed organization can outperform strong existing harnesses, while OpenCollab's single-agent configuration uses the fewest tokens across all evaluated suites. OpenCollab establishes a unified multi-agent infrastructure for easy programmable collaboration and controlled causal evaluation.

<a id="paper-2603-16104"></a>

### 4.7 Helium

[论文](https://arxiv.org/abs/2603.16104)

**主张与研究方法：** Helium 处理结构相同、输入不同的一批 Agent 工作流。用户先描述哪些 LLM 调用依赖哪些结果，系统将其转换成有向无环图：节点是模型调用或数据处理，边表示结果交给谁。它据此联合优化整条流程。

1. **先减少调用。** 删除不影响最终输出的节点，合并输入相同的重复子流程；对于满足确定性条件、已经执行过的相同输入，直接读取缓存的完整输出，跳过该次模型调用。
2. **再减少重复输入计算。** 分析 prompt 模板的共同前缀，主动计算并保留可共享的 KV，供后续调用复用。这里缓存的是模型输入状态，与第一步缓存完整回答不同。
3. **按缓存与依赖安排执行。** 结合模型计算成本、共同前缀和机器负载，决定调用分配到哪张 GPU、按什么顺序运行，争取在相关缓存仍可用时使用它。

若同一批文档都要先生成相同背景再交给不同角色处理，共同背景可以复用；最终回答仍取决于各自文档。工作流输出相同与只共享一段前缀，分别对应不同层次的复用。

**主要结论：** 在规定好的工作流上，减少调用、缓存输出、复用 KV 和安排执行顺序共同改善端到端耗时。论文限定同一基础模型、LLM 调用和本地数据操作，没有覆盖远程工具 API；因此其成本条件与开放式编码 Agent 不同。实测含 Qwen3-8B／14B、H100 NVL，多数实验使用 vLLM v0.16.0。

Agentic workflows are composed of sequences of interdependent Large Language Model (LLM) calls, and they have become a dominant workload in modern AI systems. **These workflows exhibit extensive redundancy from overlapping prompts and intermediate results due to speculative and parallel exploration.** Existing LLM serving systems, such as vLLM, focus on optimizing individual inference calls and overlook cross-call dependencies, leading to significant inefficiencies. This paper rethinks LLM and agent serving from a data systems perspective and introduces **Helium, a workflow-aware serving framework that models agentic workloads as query plans and treats LLM invocations as first-class operators**. Helium integrates proactive caching and cache-aware scheduling to maximize reuse across prompts, KV states, and workflows. Through these techniques, Helium bridges classic query optimization principles with LLM serving, achieving up to 1.56x speedup over state-of-the-art agent serving systems on various workloads. Our results demonstrate that end-to-end optimization across workflows is essential for scalable and efficient LLM-based agents.

<a id="paper-2611-08723"></a>

### 4.8 DeCAF

[论文](https://arxiv.org/html/2611.08723)

**主张与研究方法：** 一个 Agent 工作流的提示词、模型选择、调用顺序和工具策略相互影响，直接让一个优化器同时修改全部内容，很难判断变化为什么有效。DeCAF 将优化拆成三个阶段。

1. **Divide：分开探索修改方向。** 从同一份初始工作流出发，为提示词、模型、流程结构等方向安排独立编码 Agent，每位只能修改规定范围，在开发集上评测，并记录候选方案与结果。
2. **Diagnose：检查修改怎样影响执行。** 每个方向保留质量、费用、耗时之间有不同取舍的方案及实验记录。整合阶段还可调用 node_eval，读取组件的输入输出和执行轨迹，定位可能拖累结果的环节。
3. **Compose：组合并重新验收。** 整合 Agent 获得各方向的代码和发现，可以修改完整工作流。它组合候选修改，在开发集上重新运行；若效果变差，再据诊断调整。最终选定方案用留出测试集评估。

例如更换模型后，原先有效的提示词可能不再适用；分别改善的修改合到一起仍需重测。

**主要结论：** 在 AppWorld、LiveCodeBench、AgentDojo、PostTrainBench v1.1 上，作者报告优化后的部署流程兼顾任务分数、延迟与费用，但寻找方案本身增加了成本。node_eval 的受控故障定位也会把下游受害组件误认为源头，不能将其当作精确因果证明。这里的多 Agent 首先用于优化另一个工作流，最终部署方案未必包含同样多的 Agent。

Building agentic pipelines that achieve high task performance while keeping cost and latency low requires jointly optimizing heterogeneous and coupled design choices, including prompts, topology, model selection, and tool policies. Manually searching this combinatorial design space is expensive and time-consuming, while existing automated optimizers typically operate within a predefined subset of this space, modify the pipeline monolithically, or provide little structured evidence for pipeline changes. To mitigate these challenges, we introduce the **Decomposed Credit-Assignment Framework (DeCAF)**, which **adapts the design space to the given benchmark and pipeline, optimizes each dimension separately, and generates reasoning traces for every decision**. Given a task specification, benchmark examples, and a seed pipeline, DeCAF identifies relevant optimization dimensions and generates diverse experimental hypotheses for each. Independent coding-agent sessions then optimize each dimension under a restricted edit scope, jointly evaluating performance, inference cost, and latency while recording all hypotheses, edits, and outcomes of each experiment. A final synthesis session combines compatible findings across all dimensions and uses a component-level trajectory evaluator, which derives role-specific rubrics from each agent’s instructions, to localize underperforming components and guide cross-dimension revisions. Across a diverse suite of agentic benchmarks, DeCAF improves average task performance by 2.58 percentage points, while reducing inference cost by 4.30% and end-to-end latency by 42.45% compared to the best overall baseline.

<a id="paper-2308-00352"></a>

### 4.9 MetaGPT

[论文](https://arxiv.org/abs/2308.00352)

**主张与研究方法：** MetaGPT 将软件开发组织成一套标准操作流程（SOP）：产品经理整理需求，架构师设计模块与接口，项目经理拆分实现任务，程序员写代码，再通过执行反馈修改。

每个角色需要交付规定格式的文档或代码，让后续角色明确可以使用什么信息。系统用共享消息池保存这些产物，成员按角色订阅相关消息；前序文档到达后触发下一步工作。程序员执行代码、读取报错，再修订实现，形成“交付—执行—反馈—修改”的循环。

例如，架构师先交付模块目录和接口说明，程序员依据这些约定实现文件。流程将口头讨论转成可被后续角色使用的具体交付物，减少重复解释和不明确的交接。

**主要结论：** 原文在 HumanEval、MBPP 上测代码生成，在 SoftwareDev 上测软件开发、运行时间、token 和人工修改负担。结构化交付与执行反馈改善了所测任务的表现。这些设置包含函数级生成与需求驱动项目开发，其结果不能直接代表真实仓库多人并行修改的效率。

Remarkable progress has been made on automated problem solving through societies of agents based on large language models (LLMs). Existing LLM-based multi-agent systems can already solve simple dialogue tasks. Solutions to more complex tasks, however, are complicated through logic inconsistencies due to cascading hallucinations caused by naively chaining LLMs. Here we introduce **MetaGPT**, an innovative meta-programming framework incorporating efficient human workflows into LLM-based multi-agent collaborations. **MetaGPT encodes Standardized Operating Procedures (SOPs) into prompt sequences for more streamlined workflows**, thus allowing agents with human-like domain expertise to verify intermediate results and reduce errors. **MetaGPT utilizes an assembly line paradigm to assign diverse roles to various agents, efficiently breaking down complex tasks into subtasks involving many agents working together.** On collaborative software engineering benchmarks, MetaGPT generates more coherent solutions than previous chat-based multi-agent systems. Our project can be found at [this https URL](https://github.com/geekan/MetaGPT)
<a id="paper-2411-04468"></a>

### 4.10 Magentic-One

[论文](https://arxiv.org/abs/2411.04468) · [代码](https://github.com/microsoft/autogen)

**主张与研究方法：** Magentic-One 用一个负责人调度浏览网页、阅读文件、写代码和执行代码的专门 Agent，处理需要多步交互的综合任务。它在 AutoGen 上实现，并通过两份工作记录维持执行方向。

任务记录保存已知事实、需要调查的问题、暂时假设和整体计划。进度记录检查当前是否完成、是否卡住或陷入重复，并指定下一位执行者及其行动。通常先按计划调用专门 Agent、读取结果，再决定下一步；若持续没有进展，则回到外层更新事实和计划，重新组织执行。

例如，核对一份 PDF 中的说法，需要文件 Agent 读取内容、网页 Agent 查找证据，必要时让编码 Agent 计算，再由负责人汇总。不同工具能力经负责人串接成完整流程。

**主要结论：** 原文使用 GAIA、AssistantBench、WebArena，覆盖真实网页或可交互网站中的任务，模型设置包括 GPT-4o 及与 o1-preview 的组合。复杂任务能从调度、进度检查和重新规划中受益，短任务则可能承担额外协调成本。论文重点是通用任务完成，不能据此认为更多角色一定更快。

Modern AI agents, driven by advances in large foundation models, promise to enhance our productivity and transform our lives by augmenting our knowledge and capabilities. To achieve this vision, AI agents must effectively plan, perform multi-step reasoning and actions, respond to novel observations, and recover from errors, to successfully complete complex tasks across a wide range of scenarios. In this work, we introduce **Magentic-One**, a high-performing open-source agentic system for solving such tasks. **Magentic-One uses a multi-agent architecture where a lead agent, the Orchestrator, plans, tracks progress, and re-plans to recover from errors.** Throughout task execution, the Orchestrator directs other specialized agents to perform tasks as needed, such as operating a web browser, navigating local files, or writing and executing Python code. We show that Magentic-One achieves statistically competitive performance to the state-of-the-art on three diverse and challenging agentic benchmarks: GAIA, AssistantBench, and WebArena. Magentic-One achieves these results without modification to core agent capabilities or to how they collaborate, demonstrating progress towards generalist agentic systems. Moreover, Magentic-One's **modular design** allows agents to be added or removed from the team without additional prompt tuning or training, easing development and making it extensible to future scenarios. We provide an open-source implementation of Magentic-One, and we include AutoGenBench, a standalone tool for agentic evaluation. AutoGenBench provides built-in controls for repetition and isolation to run agentic benchmarks in a rigorous and contained manner -- which is important when agents' actions have side-effects. Magentic-One, AutoGenBench and detailed empirical performance evaluations of Magentic-One, including ablations and error analysis are available at [this https URL](https://aka.ms/magentic-one)
<a id="paper-2603-21489"></a>

### 4.11 Effective Strategies for Asynchronous Software Engineering Agents

[论文](https://arxiv.org/abs/2603.21489)

**主张与研究方法：** 该工作提出 CAID，让多个工程师 Agent 在各自代码分支中异步实现任务，由管理者按照依赖安排工作，再把已完成代码逐步合入主分支。

管理者先建立工作依赖图，只有前置实现已经完成并合入主分支的任务才可委派。联系紧密或循环依赖的文件尽量交给同一工程师。每位工程师在独立 git worktree（同一仓库的隔离工作目录）中开发、运行检查，并提交代码。管理者在任务完成后整合修改、更新依赖，再给空闲工程师分配下一项工作。

交接使用结构化任务要求和可合并的提交。代码冲突需要处理，后续工作也需要与已经集成的状态同步；因此增加并行成员仍有等待、验证与合并开销。

**主要结论：** 主实验使用 Commit0-Lite，以及 PaperBench 的 Code-Dev 协议，基于 OpenHands 比较单 Agent 和分支合并团队，测试包含 Claude 4.5 Sonnet、GLM 4.7、MiniMax 2.5。作者报告任务分数改善，但墙钟时间和费用仍需分别看。Code-Dev 没有执行完整论文实验复现流程，其分数不能等同于论文结果已经复现。

AI agents have become increasingly capable at isolated software engineering (SWE) tasks such as resolving issues on Github. Yet long-horizon tasks involving multiple interdependent subtasks still pose challenges both with respect to accuracy, and with respect to timely completion. A natural approach to solving these long-horizon tasks in a timely manner is asynchronous multi-agent collaboration, where multiple agents work on different parts of the task at the same time. But effective application of multi-agent systems has proven surprisingly difficult: concurrent edits by multiple agents interfere with each other, dependencies are difficult to synchronize, and combining partial progress into a coherent whole is challenging. On the other hand, human developers have long relied on mature collaboration infrastructure to manage these challenges in large software projects. Inspired by these collaboration primitives, we introduce **Centralized Asynchronous Isolated Delegation (CAID), a structured multi-agent coordination paradigm grounded in three core SWE primitives: centralized task delegation, asynchronous execution, and isolated workspaces**. CAID constructs dependency-aware task plans through **a central manager**, executes subtasks concurrently in isolated workspaces, and consolidates progress via **structured integration** with executable test-based verification. In empirical evaluation, we find that CAID improves accuracy over single-agent baselines by 25.6% absolute on paper reproduction tasks (PaperBench) and 14.7% on Python library development tasks (Commit0). Through systematic analysis, we find that branch-and-merge is a central coordination mechanism for multi-agent collaboration, and that SWE primitives such as git worktree, git commit, and git merge enable it to be realized in a reliable and executable manner.
<a id="paper-2410-02506"></a>

### 4.12 Cut the Crap: An Economical Communication Pipeline for LLM-based Multi-Agent Systems

[论文](https://arxiv.org/abs/2410.02506) · [代码](https://github.com/yanweiyue/AgentPrune)

**主张与研究方法：** 论文提出 AgentPrune，减少多轮讨论中的无效信息传递。系统把角色视为节点、消息传递视为边：同一轮中谁把结果发给谁是一类边，上一轮的哪些结果进入下一轮是另一类边。

AgentPrune 先把边的开关放松为可优化的权重，在少量交互轮次中采样通信结构，根据最终解题质量调整权重，并加入鼓励简化结构的约束。随后按权重一次性剪去一部分连接，剩余轮次只沿保留的连接传递消息。这样，某个成员不必每轮读取所有人的全部输出。

**主要结论：** MMLU、GSM8K、MultiArith、SVAMP、AQuA 和 HumanEval 上的实验显示，一部分通信可以删除，并在所测设置中维持或改善准确率、减少 token。它优化的是消息路由与历史传递，搜索通信结构本身也有成本。评测以问答和函数级代码为主，长程工具任务中的信息依赖需要另行验证。

Recent advancements in large language model (LLM)-powered agents have shown that collective intelligence can significantly outperform individual capabilities, largely attributed to the meticulously designed inter-agent communication topologies. Though impressive in performance, existing multi-agent pipelines inherently introduce substantial token overhead, as well as increased economic costs, which pose challenges for their large-scale deployments. In response to this challenge, we propose an economical, simple, and robust multi-agent communication framework, termed **AgentPrune**, which can seamlessly integrate into mainstream multi-agent systems and prunes redundant or even malicious communication messages. Technically, AgentPrune is the first to identify and formally define the **communication redundancy** issue present in current LLM-based multi-agent pipelines, and efficiently performs one-shot pruning on the spatial-temporal message-passing graph, yielding a token-economic and high-performing communication topology. Extensive experiments across six benchmarks demonstrate that AgentPrune (1) achieves comparable results as state-of-the-art topologies at merely $5.6 cost compared to their $43.7, (2) integrates seamlessly into existing multi-agent frameworks with 28.1%∼72.8%↓ token reduction, and \textbf{(III)} successfully defend against two types of agent-based adversarial attacks with 3.5%∼10.8%↑ performance boost.
<a id="paper-2503-18891"></a>

### 4.13 AgentDropout

[论文](https://aclanthology.org/2025.acl-long.1170/) · [方法原文](https://arxiv.org/html/2503.18891#S3)

**主张与研究方法：** AgentDropout 进一步研究：除去多余消息外，某些讨论轮次是否也不需要所有角色参加？同一个角色可以在一轮中有用，在另一轮中只重复已有内容。

方法为各轮建立独立的通信权重，先采样结构、运行任务，根据任务得分优化轮内连接；再依据节点的加权连接情况，移除该轮中贡献较小的角色及其相关边。完成角色删减后，重新优化轮内与跨轮连接，继续剪去不重要的消息通道。被优化的是通信图参数，无需为此更新任务模型的权重。

**主要结论：** 作者在 MMLU、GSM8K、AQuA、MultiArith、SVAMP、HumanEval 上，用 Meta-Llama3-8B-Instruct、Qwen2.5-72B-Instruct 和 DeepSeek-V3 进行比较，报告减少 token 并改善所测任务表现。“动态”体现在不同轮次可以使用不同成员组合；它包含图结构优化阶段，不能直接理解为部署时零成本、逐条消息自动判断贡献。

Multi-agent systems (MAS) based on large language models (LLMs) have demonstrated significant potential in collaborative problem-solving. However, they still face substantial challenges of low communication efficiency and suboptimal task performance, making the careful design of the agents’ communication topologies particularly important. Inspired by the management theory that roles in an efficient team are often dynamically adjusted, we propose **AgentDropout**, which identifies redundant agents and communication across different communication rounds by **optimizing the adjacency matrices of the communication graphs and eliminates them to enhance both token efficiency and task performance**. Compared to state-of-the-art methods, AgentDropout achieves an average reduction of 21.6% in prompt token consumption and 18.4% in completion token consumption, along with a performance improvement of 1.14 on the tasks. Furthermore, the extended experiments demonstrate that AgentDropout achieves notable domain transferability and structure robustness, revealing its reliability and effectiveness. We release our code at [https://github.com/wangzx1219/AgentDropout](https://github.com/wangzx1219/AgentDropout).
<a id="paper-2604-25899"></a>

### 4.14 Pythia

[论文](https://arxiv.org/abs/2604.25899v2)

**主张与研究方法：** 编排器为每次模型调用附上工作流类型、实例和当前角色三个标识。网关把同一实例的请求串起来，从历史轨迹学习可能的角色路径和输出长度。预测被用在三个地方。

- **KV 管理。** 预测近期还会用到的前缀，将缓存提前搬到更快的层。如果下一角色所需的 prompt 已经可以构造，也可以提前做 prefill。
- **路由与排队。** 用输出长度估算单次请求的显存压力，并考虑哪些调用完成后能让下游继续，决定请求发往哪里及何时执行。
- **副本伸缩。** 按工作流阶段预测接下来不同模型的负载，调整各模型的服务副本数量。

**主要结论：** 论文先观察生产轨迹，再用 AutoGen 移植内部编码助手和 Deep Research Agent，分别基于 SWE-bench Pro 与 Deep Research Bench 构造实验负载。集群实验将原有前沿模型角色映射为 3B–14B 的 Qwen 和 Llama 系列，具体映射未披露。原型修改 SGLang 的路由、调度与分层缓存，在 8 张 A100 80GB 上测量。作者报告峰值并发时平均作业完成时间缩短为对照的约 1/1.38–1/2.90，输出吞吐为 1.12–1.96 倍。这里的证据针对服务性能，论文未验证软件修复通过率或研究报告质量的相应变化。高度动态、历史路径难以预测的工作流也可能降低提前准备的收益。

As LLM applications grow more complex, developers are increasingly adopting multi-agent architectures to decompose workflows into specialized, collaborative components, introducing structure that constrains agent behavior and exposes useful semantic predictability. Unlike traditional LLM serving, which operates under highly dynamic and uncertain conditions, this structured topology enables opportunities to **reduce runtime uncertainty**—yet existing systems fail to exploit it, treating agentic workloads as generic traffic and incurring significant inefficiencies. Our analysis of production traces from an agent-serving platform and an internal coding assistant reveals key bottlenecks, including **low prefix cache hit rates, severe resource contention from long-context requests, and substantial queuing delays due to suboptimal scaling**. To address these challenges, we propose **Pythia**, a multi-agent serving system that captures workflow semantics through a simple interface at the serving layer, unlocking new optimization opportunities and substantially improving t**hroughput and job completion time** over state-of-the-art baselines.
<a id="paper-2507-07400"></a>

### 4.15 KVFlow

[论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/b7971d31a7d5eb0f1eed2f8f6f368195-Abstract-Conference.html) · [arXiv](https://arxiv.org/abs/2507.07400v1) · [代码](https://github.com/PanZaifeng/KVFlow)

**主张与研究方法：** 编排层把角色调用顺序表示成 Agent Step Graph。每次请求携带当前角色和各角色距下次调用的步数。推理服务用这些步数更新固定提示词对应的 KV 缓存节点，显存吃紧时优先腾出距离复用较远的缓存。几个角色共享某个前缀节点时，也会考虑其中最早可能用到它的角色。

如果下一个角色的固定前缀已存在于 CPU 内存，KVFlow 可以在当前角色生成时把它预取回 GPU。调度器暂时跳过缓存仍在搬运的请求，先执行已就绪的请求。这里复用的是相同前缀已算好的 KV。

**主要结论：** 原型修改 SGLang v0.4.4 前端与后端。论文用 Llama-3.1-8B／A10G 24GB 和 Qwen2.5-32B／H100 80GB 测量合成多 Agent 工作流，并扩展到以 PEER Financial QA 为输入的四角色模拟。相对 SGLang HiCache，长提示词的单工作流最高加速 1.83 倍，合成高并发最高 2.19 倍。PEER 风格负载的最高加速为 1.08 倍。单工作流实验先预热缓存，再测完整工作流延迟。论文未测答案正确率。

Large language model (LLM) based agentic workflows have become a popular paradigm for coordinating multiple specialized agents to solve complex tasks. To improve serving efficiency, existing LLM systems employ prefix caching to reuse key-value (KV) tensors corresponding to agents' fixed prompts, thereby avoiding redundant computation across repeated invocations. However, current systems typically evict KV caches using a Least Recently Used (LRU) policy, which fails to anticipate future agent usage and often discards KV caches shortly before their reuse. This leads to frequent **cache misses** and substantial recomputation or swap- ping overhead. We present **KVFlow, a workflow-aware KV cache management framework tailored for agentic workloads**. KVFlow abstracts the agent execution schedule as an **Agent Step Graph** and assigns each agent a **steps-to-execution value that estimates its temporal proximity to future activation**. These values guide **a fine-grained eviction policy** at the KV node level, allowing KVFlow to preserve entries likely to be reused and efficiently manage shared prefixes in tree-structured caches. Moreover, KVFlow introduces a fully overlapped **KV prefetching mechanism**, which proactively loads required tensors from CPU to GPU in background threads for agents scheduled in the next step, thereby avoiding cache miss stalls during generation. Compared to SGLang with hierarchical radix cache, KVFlow achieves up to 1.83× speedup for single workflows with large prompts, and up to 2.19× speedup for scenarios with many concurrent workflows.
<a id="paper-2609-08572"></a>

### 4.16 AgentGrad

[论文](https://arxiv.org/abs/2609.08572v3) · [作者仓库](https://github.com/mlvlab/AgentGrad)

**主张与研究方法：** 从一条失败轨迹出发，按执行顺序倒着检查角色。先给最后一个角色临时补充来自训练答案或验收约束的线索，复用此前角色的输出，只重跑该角色及其下游。如果最终结果通过验收，就把这个角色标为可修复点。仍失败的样本继续往上游尝试。能靠一个角色补救只说明改这里可能有效，无法据此确定最早出错的位置。

优化器对照同一输入下的原始输出和干预后输出，写出自然语言修改建议，论文称其为 textual gradient。相似建议按含义分组，例如把多条遗漏证据出处的反馈合成一条可重用的提示词规则。候选提示词先在对应失败样本中检查，再通过留出的验证集才接受。部署时使用优化后的提示词，无须提供临时线索或更新模型权重。

**主要结论：** 五项基准为 HotpotQA、HoVer、PUPA、IFBench 和 MATH。前四项沿用 GEPA 的多 Agent 系统、划分和奖励函数，MATH 沿用 MACM 的设置。任务与优化器使用同一底座，分别比较 GPT-5-mini 和 Qwen3-8B。两种底座在五项平均分上均高于对照。表 4 报告 GPT-5-mini 的离线优化平均耗时 136 分钟，GEPA 为 337 分钟。附录 O 报告实验服务器配置为 4 张 RTX A6000 和 256 GB 内存，推理引擎未披露。论文的答案泄漏审计也发现，少量最终提示词仍含训练样本的特定内容。

Large language model (LLM)-based multi-agent systems (MAS) achieve strong performance by employing specialized multiple agents, yet their performance depends on the prompt design of each agent. For MAS prompt optimization, **textual gradient** methods that guide prompt updates using natural-language feedback have emerged as a leading paradigm. In this paper, we identify limitations in two stages of existing textual gradient approaches: **gradient extraction and gradient aggregation**. In gradient extraction, previous works select a prompt to update without verifying whether modifying it resolves the failure, and derive gradients without agent-level supervision over the corresponding agent's intermediate output. In gradient aggregation, individual gradients are randomly grouped and concatenated, often mixing unrelated failure modes and producing prompts that fail to generalize. To address these limitations, we propose **AgentGrad, a prompt optimization framework for multi-agent systems based on sequential intervention and semantic textual gradient abstraction**. For each failure, sequential intervention injects a hint into one agent at a time to identify the target agent whose modification resolves the failure. The modified output of the target agent then serves as agent-level supervision for extracting a fine-grained gradient. Semantic textual gradient abstraction clusters semantically similar gradients to prevent mixing unrelated failure modes, and abstracts each cluster into a generalized gradient that captures the shared corrective pattern. Experimental results show that AgentGrad achieves state-of-the-art performance across five MAS benchmarks while reducing wall-clock optimization time by 2.5 times and optimization cost by 21.8% on average compared to the next-best baselines. Our code is available at [this https URL](https://github.com/mlvlab/AgentGrad).
<a id="topic-synthesis"></a>

## 5. Survey
<a id="survey-overview"></a>
<a id="survey-mapping"></a>
<a id="survey-comparison"></a>
### 5.1 Benchmark

| Benchmark／负载                                      | 相关论文                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CooperBench                                       | [Shepherd](#paper-2605-10913)、[Relic](#paper-2609-32965)、[Harbor Adapters](#paper-2609-04298)                                                                                                                                                                                                                                                                                |
| SWE-bench 系列（原版／Lite／Verified／Pro／Pro V2）         | [OpenCollab](#paper-2609-38345)、[Pairing Matters](#paper-2610-32131)、[Capable language models can outgrow the benefits of collaboration](#paper-2512-08296)、[AgentPerfBench](#paper-2609-34683)、[Pythia](#paper-2604-25899) |
| ProgramBench                                      | [Scaling Inference-Time Compute with Teams of Coding Agents](#paper-2610-17471)、[Relic](#paper-2609-32965)                                                                                                                                                                                                                                                                   |
| Commit0（含 Lite）                                   | [Scaling Inference-Time Compute with Teams of Coding Agents](#paper-2610-17471)、[Effective Strategies for Asynchronous Software Engineering Agents](#paper-2603-21489)                                                                                                                                                                                        |
| Terminal-Bench 系列                                 | [OpenCollab](#paper-2609-38345)、[Capable language models can outgrow the benefits of collaboration](#paper-2512-08296)、[AgentPerfBench](#paper-2609-34683)                                                                                                                                                                                                                   |
| DeepSWE                                           | [OpenCollab](#paper-2609-38345)                                                                                                                                                                                                                                                                                                                                              |
| Doc2Repo／NL2Repo／CodeProjectEval                  | [AECP](#paper-2610-06481)                                                                                                                                                                                                                                                                                                                                                    |
| GAIA／AssistantBench                               | [Magentic-One](#paper-2411-04468)、[Learning to Share](#paper-2602-05965)                                                                                                                                                                                                                                                                                      |
| WebArena                                          | [Magentic-One](#paper-2411-04468)                                                                                                                                                                                                                                                                                                                             |
| SkillsBench                                       | [Subagents vs Agent Skills](#paper-2609-09233)                                                                                                                                                                                                                                                                                                                               |
| PaperBench（Code-Dev）                              | [Effective Strategies for Asynchronous Software Engineering Agents](#paper-2603-21489)                                                                                                                                                                                                                                                                        |
| HumanEval                                         | [MetaGPT](#paper-2308-00352)、[Cut the Crap](#paper-2410-02506)、[AgentDropout](#paper-2503-18891)、[KVCMAS](#paper-2609-34060)                                                                                                                                                                                        |
| MBPP／SoftwareDev                                  | [MetaGPT](#paper-2308-00352)                                                                                                                                                                                                                                                                                                                                  |
| MMLU／GSM8K                                        | [Cut the Crap](#paper-2410-02506)、[AgentDropout](#paper-2503-18891)、[KVCMAS](#paper-2609-34060)                                                                                                                                                                                                                                    |
| MultiArith／SVAMP／AQuA                             | [Cut the Crap](#paper-2410-02506)、[AgentDropout](#paper-2503-18891)                                                                                                                                                                                                                                                                |
| HotpotQA（多跳问答）／HoVer／PUPA／IFBench／MATH | [AgentGrad](#paper-2609-08572) |
| HotpotQA／ScienceQA                                | [LRAgent](#paper-2602-01053)                                                                                                                                                                                                                                                                                                                                                 |
| MathVista／Video-MME                               | [KVCMAS](#paper-2609-34060)                                                                                                                                                                                                                                                                                                                                                  |
| AppWorld／LiveCodeBench／AgentDojo／PostTrainBench   | [DeCAF](#paper-2611-08723)                                                                                                                                                                                                                                                                                                                                                   |
| Finance Agent／BrowseComp-Plus／PlanCraft／Workbench | [Capable language models can outgrow the benefits of collaboration](#paper-2512-08296)                                                                                                                                                                                                                                                                                       |
| MultiAgentBench（Research／Bargaining）／MACS／ConVerse              | [MASEval](#paper-acl26-maseval)                                                                                                                                                                                                                                                                                                                        |
| Deep Research Bench | [Pythia](#paper-2604-25899) |
| OSWorld 轨迹                                        | [AgentPerfBench](#paper-2609-34683)                                                                                                                                                                                                                                                                                                                                          |
| 自建工作流                                             | [SquidAgent](#paper-2610-08647)、[Parrot](#paper-2405-19888)、[Helium](#paper-2603-16104)                                                                                                                                                                                                                                                                                      |
| PEER Financial QA（模拟工作流） | [KVFlow](#paper-2507-07400) |
| 合成／请求回放负载                                         | [LRAgent](#paper-2602-01053)、[KVCMAS](#paper-2609-34060)、[AgentPerfBench](#paper-2609-34683)、[KVFlow](#paper-2507-07400) |


### 5.2 Harness

| Harness／评测框架                    | 相关论文                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OpenHands 系列（含 SDK）             | [CooperBench](#paper-2601-13295)、[Harbor Adapters](#paper-2609-04298)、[Subagents vs Agent Skills](#paper-2609-09233)、[OpenCollab](#paper-2609-38345)、[Pairing Matters](#paper-2610-32131)、[Effective Strategies for Asynchronous Software Engineering Agents](#paper-2603-21489)                                                                              |
| SWE-agent 系列（含 mini-SWE-agent）  | [ProgramBench](#paper-2605-03546)、[AECP](#paper-2610-06481)、[Relic](#paper-2609-32965)、[OpenCollab](#paper-2609-38345)、[Pairing Matters](#paper-2610-32131)                                                                                                                                                                                                   |
| Claude Code／Claude Agent SDK    | [SquidAgent](#paper-2610-08647)、[OpenCollab](#paper-2609-38345)、[DeCAF](#paper-2611-08723)                                                                                                                                                                                                                                                                    |
| Codex CLI                       | [OpenCollab](#paper-2609-38345)                                                                                                                                                                                                                                                                                                                               |
| OpenCode                        | [Shepherd](#paper-2605-10913)、[Pairing Matters](#paper-2610-32131)                                                                                                                                                                                                                                                                                            |
| AutoCodeRover／Agentless         | [Pairing Matters](#paper-2610-32131)                                                                                                                                                                                                                                                                                                                          |
| AutoGen／Magentic-One            | [Magentic-One](#paper-2411-04468)、[Learning to Share](#paper-2602-05965)、[Pythia](#paper-2604-25899) |
| AWS Strands                     | [AECP](#paper-2610-06481)                                                                                                                                                                                                                                                                                                                                     |
| AutoAct                         | [LRAgent](#paper-2602-01053)                                                                                                                                                                                                                                                                                                                                  |
| KVComm                          | [KVCMAS](#paper-2609-34060)                                                                                                                                                                                                                                                                                                                                   |
| AutoGPT／CORE-Agent              | [CORE-Bench](#paper-2409-11363)                                                                                                                                                                                                                                                                                                                               |
| smolagents／LangGraph／LlamaIndex | [MASEval](#paper-acl26-maseval)                                                                                                                                                                                                                                                                                                                               |
| Harbor                          | [Harbor Adapters](#paper-2609-04298)、[SWE-Bench Pro V2](#paper-2610-24206)、[Terminal-Bench 2.1](#paper-2611-08417)                                                                                                                                                                                                                                            |
| 论文自建编排                          | [MetaGPT](#paper-2308-00352)、[Cut the Crap](#paper-2410-02506)、[AgentDropout](#paper-2503-18891)、[Capable language models can outgrow the benefits of collaboration](#paper-2512-08296)、[Scaling Inference-Time Compute with Teams of Coding Agents](#paper-2610-17471)、[Relic](#paper-2609-32965)、[OpenCollab](#paper-2609-38345)、[DeCAF](#paper-2611-08723) |
| 作者自建对话评测框架 | [AgentCollabBench](#paper-2605-08647) |
| SGLang 前端（定制工作流） | [KVFlow](#paper-2507-07400) |
| GEPA 评测系统／MACM | [AgentGrad](#paper-2609-08572) |
| 服务与回放框架                         | [Parrot](#paper-2405-19888)、[Helium](#paper-2603-16104)、[AgentPerfBench](#paper-2609-34683)                                                                                                                                                                                                                                                                   |

### 5.3 推理引擎

| 推理引擎 | 相关论文 |
| --- | --- |
| vLLM | [Subagents vs Agent Skills](#paper-2609-09233)、[KVCMAS](#paper-2609-34060)、[Helium](#paper-2603-16104)、[AgentPerfBench](#paper-2609-34683)、[Pairing Matters](#paper-2610-32131) |
| SGLang | [AgentPerfBench](#paper-2609-34683)、[Pythia](#paper-2604-25899)、[KVFlow](#paper-2507-07400) |
| Parrot Engine | [Parrot](#paper-2405-19888) |
| FastChat／Transformers（定制实现） | [LRAgent](#paper-2602-01053) |

### 5.4 任务 × 单／多用户

| 任务               | 单用户                                                                                                                                                                                                                                                                                                                        | 多用户                                 |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 同仓库功能开发与补丁集成     | [CooperBench](#paper-2601-13295)、[Shepherd](#paper-2605-10913)、[Relic](#paper-2609-32965)、[Harbor Adapters](#paper-2609-04298)                                                                                                                                                                                             | —                                   |
| 真实仓库 issue 定位与修复 | [SWE-bench](#paper-2310-06770)、[SWE-Bench Pro V2](#paper-2610-24206)、[OpenCollab](#paper-2609-38345)、[Pairing Matters](#paper-2610-32131)、[Capable language models can outgrow the benefits of collaboration](#paper-2512-08296)                                                                                           | [AgentPerfBench](#paper-2609-34683)、[Pythia](#paper-2604-25899) |
| 按规格生成项目／从零实现程序   | [MetaGPT](#paper-2308-00352)、[AECP](#paper-2610-06481)、[ProgramBench](#paper-2605-03546)、[Scaling Inference-Time Compute with Teams of Coding Agents](#paper-2610-17471)、[Effective Strategies for Asynchronous Software Engineering Agents](#paper-2603-21489)、[Relic](#paper-2609-32965)、[SquidAgent](#paper-2610-08647) | —                                   |
| 网页检索、文件处理与终端工具操作 | [Magentic-One](#paper-2411-04468)、[Learning to Share](#paper-2602-05965)、[Subagents vs Agent Skills](#paper-2609-09233)、[Terminal-Bench 2.1](#paper-2611-08417)、[OpenCollab](#paper-2609-38345)、[Capable language models can outgrow the benefits of collaboration](#paper-2512-08296)、[DeCAF](#paper-2611-08723)          | [AgentPerfBench](#paper-2609-34683) |
| 运行科研代码／实现论文方法    | [CORE-Bench](#paper-2409-11363)、[Effective Strategies for Asynchronous Software Engineering Agents](#paper-2603-21489)                                                                                                                                                                                                     | —                                   |
| 函数与仓库级代码生成       | [MetaGPT](#paper-2308-00352)、[Cut the Crap](#paper-2410-02506)、[AgentDropout](#paper-2503-18891)、[KVCMAS](#paper-2609-34060)、[DeCAF](#paper-2611-08723)                                                                                                                                                                    | —                                   |
| 数学、知识与多模态问答      | [Cut the Crap](#paper-2410-02506)、[AgentDropout](#paper-2503-18891)、[LRAgent](#paper-2602-01053)、[KVCMAS](#paper-2609-34060)、[AgentGrad](#paper-2609-08572) | —                                   |
| 研究报告、汇总与技术写作     | [SquidAgent](#paper-2610-08647)、[Parrot](#paper-2405-19888)、[MASEval](#paper-acl26-maseval)                                                                                                                                                                                                                                | [Helium](#paper-2603-16104)、[Pythia](#paper-2604-25899) |
| 多 Agent 工作流推理（单工作流／独立工作流并发） | [KVFlow](#paper-2507-07400) | [KVFlow](#paper-2507-07400) |
| 软件工程、运维与数据工程的消息交接 | [AgentCollabBench](#paper-2605-08647) | — |
| 财务分析、约束规划与谈判     | [Capable language models can outgrow the benefits of collaboration](#paper-2512-08296)、[SquidAgent](#paper-2610-08647)、[MASEval](#paper-acl26-maseval)、[KVFlow](#paper-2507-07400) | —                                   |

<a id="survey-experiment-conditions"></a>
<a id="materials-index"></a>
## 6. Materials Index

| 论文（原文）                                                                      | 主要内容                        | 本文位置                      |
| --------------------------------------------------------------------------- | --------------------------- | ------------------------- |
| [CooperBench](https://arxiv.org/abs/2601.13295) | 分别开发两项功能，合并补丁后联合验收 | [§2.1](#paper-2601-13295) |
| [SWE-bench](https://arxiv.org/abs/2310.06770) | 根据真实 issue 修改仓库，并用测试验收补丁 | [§2.2](#paper-2310-06770) |
| [SWE-Bench Pro V2](https://arxiv.org/abs/2610.24206) | 修订题目与测试，在干净环境中重新验收补丁 | [§2.3](#paper-2610-24206) |
| [ProgramBench](https://arxiv.org/abs/2605.03546) | 只看参考程序和文档，从空目录重建兼容实现 | [§2.4](#paper-2605-03546) |
| [Terminal-Bench 2.1](https://arxiv.org/abs/2611.08417) | 持续修复任务、验证器与资源预算，维护评测有效性 | [§2.5](#paper-2611-08417) |
| [CORE-Bench](https://arxiv.org/abs/2409.11363) | 运行已有论文代码与数据，回答计算结果问题 | [§2.6](#paper-2409-11363) |
| [Harbor Adapters](https://arxiv.org/abs/2609.04298) | 统一任务封装，并检查迁移前后评分是否一致 | [§2.7](#paper-2609-04298) |
| [AgentPerfBench](https://arxiv.org/abs/2609.34683) | 保留会话顺序和前缀结构，回放请求测试推理服务 | [§2.8](#paper-2609-34683) |
| [Capable language models can outgrow the benefits of collaboration](https://www.nature.com/articles/s42256-026-01268-y) | 固定任务与系统预算，比较组队何时有收益 | [§2.9](#paper-2512-08296) |
| [Pairing Matters](https://arxiv.org/abs/2610.32131) | 固定任务和模型服务，更换模型与运行框架组合 | [§2.10](#paper-2610-32131) |
| [Scaling Inference-Time Compute with Teams of Coding Agents](https://arxiv.org/abs/2610.17471) | 比较规划、实现、验证分别委派给 worker 的收益 | [§2.11](#paper-2610-17471) |
| [MASEval](https://aclanthology.org/2026.acl-demo.34/) | 分开任务、环境、Agent 和评分，统一记录多成员执行 | [§2.12](#paper-acl26-maseval) |
| [AgentCollabBench](https://arxiv.org/abs/2605.08647v1) | 测量约束和证据在多 Agent 交接中的保留情况 | [§2.13](#paper-2605-08647) |
| [AECP](https://arxiv.org/abs/2610.06481)                                    | 读相关代码时投递发现，提交实现时检查接口约定 | [§3.1](#paper-2610-06481) |
| [Learning to Share](https://arxiv.org/abs/2602.05965)                       | 筛选值得共享的步骤结果，摘要供其他团队按需读取 | [§3.2](#paper-2602-05965) |
| [Subagents vs Agent Skills](https://arxiv.org/abs/2609.09233)               | 给子 Agent 明确输入输出，隔离技能执行的中间过程 | [§3.3](#paper-2609-09233) |
| [Relic](https://arxiv.org/abs/2609.32965v2) | 把协作失败转成持续执行、可由新成员继承的规则 | [§3.4](#paper-2609-32965) |
| [Parrot](https://www.usenix.org/conference/osdi24/presentation/lin-chaofan) | 显式标记调用之间传递的内容，让服务端联合调度 | [§4.1](#paper-2405-19888) |
| [SquidAgent](https://arxiv.org/abs/2610.08647)                              | 估计执行与协调代价，再逐层决定串行或并行 | [§4.2](#paper-2610-08647) |
| [LRAgent](https://arxiv.org/abs/2602.01053)                                 | 把角色缓存拆成共同基础与低秩增量，分别复用 | [§4.3](#paper-2602-01053) |
| [KVCMAS](https://arxiv.org/abs/2609.34060)                                  | 用历史参考估计角色切换的 KV 差值，可靠时复用 | [§4.4](#paper-2609-34060) |
| [Shepherd](https://arxiv.org/abs/2605.10913) | 记录并分叉 Agent 与环境状态，支持监督和局部重放 | [§4.5](#paper-2605-10913) |
| [OpenCollab](https://arxiv.org/abs/2609.38345) | 用同一执行底座组织团队，并审计角色是否实际参与 | [§4.6](#paper-2609-38345) |
| [Helium](https://arxiv.org/abs/2603.16104) | 从工作流依赖中减少调用，复用回答与输入缓存 | [§4.7](#paper-2603-16104) |
| [DeCAF](https://arxiv.org/html/2611.08723) | 多个 Agent 分方向优化工作流，再组合并重新测试 | [§4.8](#paper-2611-08723) |
| [MetaGPT](https://arxiv.org/abs/2308.00352) | 按标准开发流程交付需求、设计和代码，并用运行反馈迭代 | [§4.9](#paper-2308-00352) |
| [Magentic-One](https://arxiv.org/abs/2411.04468) | 负责人维护任务和进度记录，调度网页、文件及编码 Agent | [§4.10](#paper-2411-04468) |
| [Effective Strategies for Asynchronous Software Engineering Agents](https://arxiv.org/abs/2603.21489) | 按依赖异步分派工程师，在隔离分支验证后合并代码 | [§4.11](#paper-2603-21489) |
| [Cut the Crap: An Economical Communication Pipeline for LLM-based Multi-Agent Systems](https://arxiv.org/abs/2410.02506) | 学习轮内和跨轮消息连接，剪去冗余边后继续讨论 | [§4.12](#paper-2410-02506) |
| [AgentDropout](https://aclanthology.org/2025.acl-long.1170/) | 按讨论轮次筛选角色，再删去轮内与跨轮冗余通信 | [§4.13](#paper-2503-18891) |
| [Pythia](https://arxiv.org/abs/2604.25899v2) | 用工作流预测安排 KV、请求优先级和模型副本 | [§4.14](#paper-2604-25899) |
| [KVFlow](https://proceedings.neurips.cc/paper_files/paper/2025/hash/b7971d31a7d5eb0f1eed2f8f6f368195-Abstract-Conference.html) | 按下次调用步距保留并预取角色的固定前缀 KV | [§4.15](#paper-2507-07400) |
| [AgentGrad](https://arxiv.org/abs/2609.08572v3) | 用逐角色干预找到可修复点，再改写和验证提示词 | [§4.16](#paper-2609-08572) |
