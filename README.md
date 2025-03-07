# LLM Adversarial Audit

## Overview

**LLM Adversarial Audit** is a specialized tool designed to help researchers and developers assess the robustness of Large Language Models (LLMs) against adversarial, manipulative, or potentially harmful prompts. The tool provides an intuitive interface for manual prompt testing, enabling users to evaluate model responses, identify vulnerabilities, and refine prompt engineering techniques.

We created both a **manual input version** and an **automatically run adversarial version**, where two LLMs are adversarially confronted. One LLM acts as the interviewer, attempting to elicit malicious responses, while the other serves as the tested LLM, allowing researchers to analyze susceptibility to adversarial manipulation.

## Key Features

- **Manual Prompt Testing**: A clean, streamlined interface for testing LLM responses to custom prompts.
- **Multi-Model Support**: Test against leading LLMs, including GPT-4, GPT-3.5-Turbo, and simulated versions of Claude, Llama, and Gemini.
- **Conversation History**: Maintain multi-turn context to analyze model behavior in extended interactions.
- **Follow-up Questioning**: Probe model responses further with sequential queries.
- **Response Evaluation**: Analyze outputs for potential vulnerabilities, inconsistencies, or safety concerns.
- **Secure API Key Management**: Utilize environment variables for safe and flexible API integration.

## Usage Guide

1. **Select a Model**: Choose an LLM from the dropdown menu.
2. **Enter a Prompt**: Type the test prompt in the input field.
3. **Submit**: Click "Submit Prompt" to send it to the selected model.
4. **Analyze Response**: Review and assess the model’s output.
5. **Follow Up**: Continue the conversation to explore more complex interactions.

## Use Cases

- **Red Team Testing**: Identify vulnerabilities in LLM implementations and improve security.
- **Prompt Engineering Research**: Explore prompt variations to refine AI interactions.
- **Safety Assessment**: Evaluate responses to potentially harmful or misleading inputs.
- **Educational Purposes**: Gain insights into LLM behavior, biases, and limitations.