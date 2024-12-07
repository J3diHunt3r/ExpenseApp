import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/ChatBotIntegration')({
  component: ChatBotIntegration,
});

function ChatBotIntegration() {
  useEffect(() => {
    // Ensure scripts are only added once
    if (!document.getElementById('chatling-embed-script')) {
      const configScript = document.createElement('script');
      configScript.innerHTML = `
        window.chtlConfig = { 
          chatbotId: "4637229784", 
          display: "page_inline" 
        };
      `;
      document.body.appendChild(configScript);

      const embedScript = document.createElement('script');
      embedScript.id = 'chatling-embed-script';
      embedScript.async = true;
      embedScript.src = 'https://chatling.ai/js/embed.js';
      embedScript.setAttribute('data-id', '4637229784');
      embedScript.setAttribute('data-display', 'page_inline');
      document.body.appendChild(embedScript);
    }
  }, []);

  return (
    <div
      id="chatling-inline-bot"
      style={{ width: '100%', height: '700px' }}
    ></div>
  );
}

export default ChatBotIntegration;
