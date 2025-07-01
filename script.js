// Wait for the page to load before running our code
document.addEventListener('DOMContentLoaded', function() {
    
    // Get references to all the buttons and response area
    const iceBtn = document.getElementById('iceBtn');
    const factBtn = document.getElementById('factBtn');
    const jokeBtn = document.getElementById('jokeBtn');
    const weatherBtn = document.getElementById('weatherBtn');
    const responseDiv = document.getElementById('response');
    
    // Function to call OpenAI API
    async function callOpenAI(userPrompt) {
        try {
            // Show fun loading message while waiting for AI
            responseDiv.textContent = 'Hold on, let me think of something amazing... ✨�';
            
            // System message that controls the bot's personality
            const systemMessage = {
                role: 'system',
                content: 'You are Fillr, a friendly and engaging conversation starter bot. Your responses should be fun, approachable, and help people connect with each other. Keep your responses concise, entertaining, and appropriate for all audiences. Always aim to spark interesting conversations and make people smile.'
            };
            
            // User message with the specific request
            const userMessage = {
                role: 'user',
                content: userPrompt
            };
            
            // Make the API call to OpenAI
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': OPENAI_API_KEY // Using the API key from secrets.js
                },
                body: JSON.stringify({
                    model: 'gpt-4.1', // Using the model specified in instructions
                    messages: [
                        systemMessage, // System message controls personality
                        userMessage    // User message with specific request
                    ],
                    max_tokens: 150,
                    temperature: 0.9 // Makes responses more creative and varied
                })
            });
            
            // Check if the API call was successful
            if (!response.ok) {
                throw new Error(`API call failed: ${response.status}`);
            }
            
            // Get the response data
            const data = await response.json();
            
            // Extract the AI's response text
            const aiResponse = data.choices[0].message.content;
            
            // Display the response on the page
            responseDiv.textContent = aiResponse;
            
        } catch (error) {
            // If something goes wrong, show a friendly error message
            console.error('Error:', error);
            
            // Check what kind of error occurred and show appropriate message
            if (error.message.includes('API call failed: 401')) {
                responseDiv.textContent = 'Oops! It looks like there\'s an issue with the API key. Please check your secrets.js file! 🔑😊';
            } else if (error.message.includes('API call failed: 429')) {
                responseDiv.textContent = 'Whoa there! We\'re getting too many requests. Let\'s take a quick breather and try again in a moment! ⏰😌';
            } else if (error.message.includes('API call failed')) {
                responseDiv.textContent = 'Hmm, the AI service seems busy right now. Give it another shot in a few seconds! 🤖💭';
            } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                responseDiv.textContent = 'Looks like there\'s a connection issue. Check your internet and try again! �😊';
            } else {
                responseDiv.textContent = 'Something unexpected happened, but don\'t worry! Just click the button again and let\'s try once more! 🎯✨';
            }
        }
    }
    
    // Add click event listeners to each button
    
    // Icebreaker button - generates conversation starter questions
    iceBtn.addEventListener('click', function() {
        const prompt = 'Generate a fun, engaging icebreaker question that would help people start a conversation. Make it interesting and not too personal.';
        callOpenAI(prompt);
    });
    
    // Weird Fact button - generates surprising facts
    factBtn.addEventListener('click', function() {
        const prompt = 'Share a weird, surprising, or fascinating fact that most people don\'t know. Make it interesting and conversation-worthy.';
        callOpenAI(prompt);
    });
    
    // Joke button - generates friendly jokes
    jokeBtn.addEventListener('click', function() {
        const prompt = 'Tell a clean, friendly joke that would make people smile. Keep it appropriate for all audiences and easy to understand.';
        callOpenAI(prompt);
    });
    
    // Weather button - generates weather conversation starters
    weatherBtn.addEventListener('click', function() {
        const prompt = 'Create a weather-related conversation starter that encourages people to share what the weather is like where they are. Make it engaging and fun.';
        callOpenAI(prompt);
    });
    
});