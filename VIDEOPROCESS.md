
# Video Multipart Upload & Processing Module

## Technical Documentation (Developer Guide)

---

## 1. Introduction

This module implements a secure and scalable video upload and processing pipeline using AWS services. It enables large video uploads through multipart upload, followed by automated video processing and transcription.

The system uses:

* AWS S3 (Multipart Upload)
* AWS MediaConvert (HLS video processing and thumbnails)
* AWS Transcribe (Speech-to-text)
* Token-based authentication (User and Admin roles)

This architecture is designed for production-level scalability, secure media handling, and optimized server performance.

---

## 2. System Overview

The upload and processing flow follows this sequence:

1. User initiates multipart upload.
2. Client uploads video in chunks directly to S3 using presigned URLs.
3. User completes multipart upload.
4. Admin triggers processing.
5. MediaConvert generates HLS outputs and thumbnails.
6. Transcribe starts transcription in parallel.
7. System returns output file paths and job identifiers.

All video files remain private in S3. No file is streamed through the backend server, ensuring scalability and reduced memory overhead.

---

## 3. Multipart Upload Workflow

### Step 1: Initiate Multipart Upload

Endpoint:
POST /upload/multipart/init

Authentication:
Bearer Token (User)

Request Body:
{
"fileName": "video.mp4",
"fileType": "video/mp4"
}

Process:

* Validates fileName and fileType.
* Generates a unique folder ID using timestamp.
* Constructs S3 key in the format:
  file/videos/{folderId}/input.{extension}
* Calls AWS S3 createMultipartUpload.
* Returns uploadId, key, and folderId.

Response:
{
"uploadId": "aws-upload-id",
"key": "file/videos/file-123456/input.mp4",
"folderId": "file-123456"
}

---

### Step 2: Sign Multipart Part

Endpoint:
POST /upload/multipart/sign-part

Authentication:
Bearer Token (User)

Request Body:
{
"key": "file/videos/file-123/input.mp4",
"uploadId": "aws-upload-id",
"partNumber": 1
}

Process:

* Generates a presigned URL for uploading a specific part.
* URL expires in 5 minutes.
* Uses S3 uploadPart operation.
* Client uploads the chunk directly to S3 using this URL.

Response:
{
"url": "[https://signed-s3-url](https://signed-s3-url)"
}

---

### Step 3: Complete Multipart Upload

Endpoint:
POST /upload/multipart/complete

Authentication:
Bearer Token (User)

Request Body:
{
"key": "file/videos/file-123/input.mp4",
"uploadId": "aws-upload-id",
"parts": [
{ "ETag": "etag-value", "PartNumber": 1 },
{ "ETag": "etag-value", "PartNumber": 2 }
]
}

Process:

* Sorts parts by PartNumber.
* Calls S3 completeMultipartUpload.
* Finalizes video upload.
* Video becomes available in S3 under private ACL.

---

## 4. Admin Video Processing

Endpoint:
POST /upload/process_file_admin

Authentication:
Bearer Token (Admin)

Request Body:
{
"s3_key": "file/videos/file-123/input.mp4",
"duration": 120
}

If s3_key is missing, validation error is returned.

---

## 5. Processing Pipeline Details

### 5.1 Input and Output Path Construction

From s3_key:
file/videos/file-123/input.mp4

System extracts:
folderId = file-123

Input URI:
s3://input-bucket/file/videos/file-123/input.mp4

Output Prefix:
file/videos/file-123/

Output Destination:
s3://output-bucket/file/videos/file-123/

---

### 5.2 MediaConvert Job

MediaConvert job creates:

1. Adaptive HLS Streaming (Apple HLS Group)

   * 2 Mbps
   * 1 Mbps
   * 400 kbps
   * 1080x1920 resolution
   * H.264 video
   * AAC audio

2. Thumbnail Output Group

   * Standard thumbnail
   * Cropped thumbnail
   * Frame capture codec
   * Single frame capture

Generated Output Structure:

file/videos/file-123/hls/playlist.m3u8
file/videos/file-123/thumbnails/inputthumbnail-.0000000.jpg
file/videos/file-123/thumbnails/inputthumbnail-cropped-.0000000.jpg

---

### 5.3 Transcribe Job

In parallel with MediaConvert:

* AWS Transcribe job is started.
* IdentifyLanguage enabled.
* Supported languages:
  en-US, uk-UA, he-IL, de-DE, ru-RU, es-ES
* Unique transcription job name generated using timestamp and random number.

The transcription job runs asynchronously.

---

## 6. Final Response After Processing Trigger

Response:
{
"transcribeJobId": "TranscribeJob-123456",
"videoUrl": "file/videos/file-123/hls/playlist.m3u8",
"thumbnailUrl": "file/videos/file-123/thumbnails/inputthumbnail-.0000000.jpg",
"thumbnailCropUrl": "file/videos/file-123/thumbnails/inputthumbnail-cropped-.0000000.jpg",
"duration": 120
}

Note: MediaConvert and Transcribe jobs continue processing in AWS after response is returned.

---

## 7. Security Design

1. All endpoints require Bearer token authentication.
2. Admin-only processing route.
3. S3 objects use private ACL.
4. Upload occurs via presigned URLs.
5. No file passes through backend server.
6. Signed URLs expire after 5 minutes.
7. Multipart upload prevents large file memory overload.

---

## 8. Scalability Considerations

* Direct-to-S3 upload prevents backend bottleneck.
* Multipart upload supports large files (GB scale).
* MediaConvert and Transcribe run independently.
* Parallel execution improves performance.
* Output is HLS-based, CDN-ready.

---

## 9. Recommended Production Enhancements

For enterprise-grade deployment, implement:

1. IAM Roles instead of static AWS credentials.
2. File type whitelist validation.
3. Maximum file size restriction.
4. Upload ownership validation (store uploadId in DB).
5. Rate limiting on upload routes.
6. SNS notifications for MediaConvert completion.
7. Job status tracking in database.

---

## 10. Conclusion

This module provides a production-ready, scalable video upload and processing pipeline. It supports large file uploads, adaptive streaming generation, thumbnail extraction, and automated transcription.

The architecture is designed to minimize server load, maintain secure storage, and enable high scalability for media-driven applications.

---


IMPORTANT->>>>

Got it 🔥 — now you're asking specifically:

👉 **In S3 Bucket → Permissions tab → what exactly do we need to configure for multipart upload + ETag to work properly?**
And you want it in **short documentation format** to add in README.

Here is the clean, copy-paste ready document 👇

---

# S3 Bucket Permission Configuration for Multipart Upload (With ETag Support)

## Overview

ETag does not need to be enabled manually in S3.
It is automatically generated by AWS S3 for each uploaded part.

However, proper **bucket permissions and CORS configuration** must be added to allow:

* Multipart upload
* uploadPart
* completeMultipartUpload
* ETag access from browser

This document explains exactly what needs to be configured inside the S3 bucket.

---

# 1️⃣ Bucket Permissions (Required IAM Actions) - check if needed

Go to:

AWS Console → S3 → Your Bucket → Permissions → Bucket Policy

Add a policy that allows multipart upload actions.

Example Bucket Policy:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowMultipartUploads",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:role/YOUR_BACKEND_ROLE"
      },
      "Action": [
        "s3:PutObject",
        "s3:AbortMultipartUpload",
        "s3:ListMultipartUploadParts",
        "s3:ListBucketMultipartUploads",
        "s3:CompleteMultipartUpload"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```

Replace:

* YOUR_ACCOUNT_ID
* YOUR_BACKEND_ROLE
* your-bucket-name

This allows backend to:

* Initiate multipart upload
* Generate signed URLs
* Complete uploads
* Abort uploads if needed

---

# 2️⃣ CORS Configuration (VERY IMPORTANT for ETag)

Go to:

AWS Console → S3 → Your Bucket → Permissions → CORS Configuration

Add:

```
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

Why This Is Important:

Browsers block access to response headers unless explicitly exposed.

If `ExposeHeaders` does not include:

```
"ETag"
```

Then frontend cannot read:

```
response.headers.etag
```

And multipart upload completion will fail.

This is the most important step for ETag handling.

---

# 3️⃣ Object Ownership & ACL Settings

Go to:

S3 → Bucket → Permissions → Object Ownership

Recommended:

* Disable ACLs
* Enable Bucket owner enforced

In code, you are already using:

```
ACL: 'private'
```

This is correct and secure.

---

# 4️⃣ Do We Need to Enable ETag Manually?

No.

ETag is:

* Automatically generated by S3
* Returned in uploadPart response
* Mandatory for completeMultipartUpload
* Always enabled by default

There is no toggle or setting in S3 to enable ETag.

The only required configuration is:

CORS → ExposeHeaders → ETag

---

# 5️⃣ Why These Permissions Are Required

Without proper bucket policy:

* createMultipartUpload will fail
* uploadPart will fail
* completeMultipartUpload will fail

Without CORS ExposeHeaders:

* Browser cannot read ETag
* Multipart completion will fail
* Upload will be stuck

---

# 6️⃣ Final Checklist for Developers

Before using multipart upload module, verify:

✔ Bucket policy allows multipart actions
✔ Backend IAM role has S3 permissions
✔ CORS configuration exposes "ETag"
✔ Bucket objects are private
✔ Signed URLs are used

---

# Conclusion

No manual configuration is required to enable ETag.

However, correct:

* Bucket Policy
* IAM Permissions
* CORS (ExposeHeaders: ETag)

must be configured for multipart upload and ETag-based completion to work correctly.

