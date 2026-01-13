import asyncio
import os
from app.services.gemini_service import gemini_service
from PIL import Image

async def test_multimodal():
    print("===========================================")
    print("   JURIS-CAPE: MULTIMODAL VERIFICATION")
    print("===========================================")
    
    # 1. Test Image Analysis
    print("\n[TEST 1] Image Analysis")
    img_path = "temp_test_image.png"
    # Create a simple red image
    img = Image.new('RGB', (100, 100), color = 'red')
    img.save(img_path)
    
    try:
        print(f"   Analyzing {img_path}...")
        result = await gemini_service.analyze_media(img_path, "What color is this image?")
        print(f"   [OK] Result: {result.strip()}")
    except Exception as e:
        print(f"   [FAIL] Failed: {e}")
    finally:
        if os.path.exists(img_path):
            os.remove(img_path)

    # 2. Test Document Analysis
    print("\n[TEST 2] Document Analysis")
    doc_path = "temp_test_doc.txt"
    with open(doc_path, "w") as f:
        f.write("This is a confidential legal contract regarding the sale of the Eiffel Tower for $100.")
        
    try:
        print(f"   Analyzing {doc_path}...")
        result = await gemini_service.analyze_media(doc_path, "Summarize this document.")
        print(f"   [OK] Result: {result.strip()}")
    except Exception as e:
        print(f"   [FAIL] Failed: {e}")
    finally:
        if os.path.exists(doc_path):
            os.remove(doc_path)
            
    # 3. Test Video Analysis
    print("\n[TEST 3] Video Analysis")
    video_path_input = input("   Enter absolute path to a video file (or press Enter to skip): ").strip()
    
    if video_path_input:
        # Strip quotes if user pasted path with quotes
        video_path = video_path_input.strip('"').strip("'")
        
        if os.path.exists(video_path):
            try:
                print(f"   Uploading & Analyzing {video_path} (this may take a moment)...")
                
                result = await gemini_service.analyze_media(video_path, "Describe what happens in this video.")
                print(f"   [OK] Result: {result.strip()}")
            except Exception as e:
                print(f"   [FAIL] Failed: {e}")
        else:
             print(f"   [WARN] File not found: {video_path}")
    else:
        print("   Skipped.")

    print("\n===========================================")
    print("   VERIFICATION COMPLETE")
    print("===========================================")

if __name__ == "__main__":
    asyncio.run(test_multimodal())
