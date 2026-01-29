import httpx
import asyncio

async def test_chat():
    urls = [
        "http://127.0.0.1:8000/api/v1/gemini/chat",
        "http://127.0.0.1:8000/api/v1/gemini/chat/"
    ]
    payload = {"message": "Hello from Python Test Script"}
    
    for url in urls:
        print(f"\nTesting URL: {url}")
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, timeout=30.0)
                
            print(f"Status Code: {response.status_code}")
            print(f"Headers: {response.headers}")
            print(f"Response Body: {response.text}")
            
            if response.status_code == 200:
                print("SUCCESS: Chat API is working!")
            else:
                print("FAILED: API returned error.")
        except Exception as e:
            print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    asyncio.run(test_chat())
