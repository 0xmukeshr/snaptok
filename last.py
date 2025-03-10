from google.cloud import speech
from collections import Counter
import re
import language_tool_python

# Initialize Google Cloud Speech client
client = speech.SpeechClient()

# Initialize grammar checker
tool = language_tool_python.LanguageTool("en-US")

# Use the GCS URI of the uploaded file
gcs_uri = "gs://bucket_to_the_cloud/audio_mono.wav"

# Create RecognitionAudio object with GCS URI
audio = speech.RecognitionAudio(uri=gcs_uri)

# Configure Speech-to-Text settings
config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
    sample_rate_hertz=16000,
    language_code="en-US",
    enable_automatic_punctuation=True,
    enable_word_time_offsets=True,
    enable_word_confidence=True,
    enable_spoken_punctuation=True,
    enable_spoken_emojis=True,
    diarization_config=speech.SpeakerDiarizationConfig(
        enable_speaker_diarization=True,
        min_speaker_count=1,
        max_speaker_count=5
    )
)

print("Processing audio file... Please wait.")

# Use synchronous recognize (for short files ≤ 1 min)
response = client.recognize(config=config, audio=audio)

# Initialize counters
disfluency_words = ["um", "uh", "like", "you know", "hmm", "ah", "uhh", "huh", "er", "mmm", "okay"]
word_count = Counter()
disfluency_count = Counter()
total_confidence = 0
num_results = 0
full_transcript = ""

def highlight_disfluencies(text, disfluency_list):
    for word in disfluency_list:
        text = re.sub(rf'\b{word}\b', f"\033[4m{word}\033[0m", text, flags=re.IGNORECASE)
    return text

def remove_disfluencies(text, disfluency_list):
    pattern = r'\b(' + '|'.join(re.escape(word) for word in disfluency_list) + r')\b'
    return re.sub(pattern, '', text, flags=re.IGNORECASE).strip()

# Process transcript
for result in response.results:
    transcript = result.alternatives[0].transcript
    confidence = result.alternatives[0].confidence
    total_confidence += confidence
    num_results += 1
    full_transcript += transcript + " "
    words = re.findall(r'\b\w+\b', transcript.lower())
    word_count.update(words)
    for word in disfluency_words:
        disfluency_count[word] += transcript.lower().count(word)

# Compute overall confidence score
avg_confidence = (total_confidence / num_results) * 100 if num_results > 0 else 0
most_common_words = word_count.most_common(5)
highlighted_transcript = highlight_disfluencies(full_transcript, disfluency_words)
cleaned_transcript = remove_disfluencies(full_transcript, disfluency_words)
corrected_text = tool.correct(cleaned_transcript)

total_words = sum(word_count.values())
total_disfluencies = sum(disfluency_count.values())

# Speech Clarity Score (Lower disfluencies -> Higher score)
clarity_score = max(100 - (total_disfluencies * 2), 0)

# Content Quality Score (Based on word richness & grammar correctness)
unique_words = len(word_count)
quality_score = min((unique_words / total_words) * 100 if total_words > 0 else 100, 100)

# Overall Score (Weighted combination of clarity, confidence, and quality)
overall_score = round((avg_confidence * 0.4) + (clarity_score * 0.3) + (quality_score * 0.3), 2)

# Print report
print("\n📊 **Speech Analysis Report** 📊")
print("=" * 50)
print(f"🔹 **Total Unique Words:** {unique_words}")
print(f"🔹 **Overall Confidence Score:** {avg_confidence:.2f}/100")
print(f"🔹 **Speech Clarity Score:** {clarity_score:.2f}/100")
print(f"🔹 **Content Quality Score:** {quality_score:.2f}/100")
print(f"🌟 **Overall Speech Score:** {overall_score}/100")

print("\n📝 **Transcript with Disfluencies Underlined:**")
print(highlighted_transcript)

print("\n✅ **Grammatically Corrected Text (Without Disfluencies):**")
print(corrected_text)

print("\n📝 **Top 5 Most Repeated Words:**")
for word, count in most_common_words:
    print(f"   - {word}: {count} times")

print("\n⏳ **Disfluency Word Analysis:**")
for word, count in disfluency_count.items():
    if count > 0:
        print(f"   - {word}: {count} times")

print("=" * 50)
