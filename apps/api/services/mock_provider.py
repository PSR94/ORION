import asyncio
import random
from typing import Dict, Any, List

class MockLLMProvider:
    """
    A deterministic mock LLM provider that returns scenario-based responses.
    """
    
    def __init__(self):
        # Scenario map: prompt keywords -> responses
        self.scenarios = {
            "escalate": {
                "thought": "The customer is frustrated with the repeated billing error. This requires higher-level authorization and a manual refund check.",
                "action": "call_tool",
                "tool": "escalate_to_human",
                "tool_input": {"reason": "Repeated billing error, high customer frustration", "priority": "high"},
                "response": "I've analyzed the situation and determined that this requires human intervention. I am escalating this to the billing supervisor."
            },
            "release": {
                "thought": "Checking deployment health metrics for service 'payments-api'. All canary tests passed, but latency is slightly elevated in us-east-1.",
                "action": "call_tool",
                "tool": "check_deployment_metrics",
                "tool_input": {"service": "payments-api", "environment": "production"},
                "response": "Deployment metrics for 'payments-api' are within acceptable bounds, though us-east-1 shows a 5% latency increase. Proceeding with caution."
            },
            "incident": {
                "thought": "Database connection timeouts detected in logs. Checking recent changes to configuration.",
                "action": "call_tool",
                "tool": "query_logs",
                "tool_input": {"query": "error: connection timeout", "timerange": "15m"},
                "response": "Identified a misconfigured connection pool size in the last deployment. Preparing a summary for the incident response team."
            }
        }

    async def generate_response(self, prompt: str, agent_role: str) -> Dict[str, Any]:
        # Simulate network latency
        await asyncio.sleep(0.5 + random.random() * 1.5)
        
        # Match scenario based on prompt
        matched_scenario = self.scenarios.get("incident") # Default
        for key, scenario in self.scenarios.items():
            if key in prompt.lower() or key in agent_role.lower():
                matched_scenario = scenario
                break
        
        return {
            "id": f"mock-{random.getrandbits(32)}",
            "content": matched_scenario["response"],
            "thought": matched_scenario["thought"],
            "tool_calls": [
                {
                    "name": matched_scenario["tool"],
                    "arguments": matched_scenario["tool_input"]
                }
            ] if matched_scenario.get("action") == "call_tool" else [],
            "usage": {
                "prompt_tokens": len(prompt) // 4,
                "completion_tokens": len(matched_scenario["response"]) // 4,
                "total_tokens": (len(prompt) + len(matched_scenario["response"])) // 4
            }
        }

mock_llm = MockLLMProvider()
