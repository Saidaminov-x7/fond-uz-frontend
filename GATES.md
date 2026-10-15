# Gates: FondUz frontend and integration

OWNS: src/**, public/messages/**, messages/**, GATES.md

Scope: verify the public site, authentication integration, localization dictionaries, and frontend security.

- [x] G1: frontend passes TypeScript checks
  CHECK: rtk npm run typecheck
  EXPECT: TYPECHECK_PASSED
  CWD: .
  EVIDENCE: automatic-evidence=v1; definition-sha256=c071a77cd199a70af023210e91a315699bb1a5bff5e0f82ec9bd459d82d4dabb; exit=0; EXPECT=matched; output-sha256=da8e272a84342eca77a9bc24d2bb1dc9db31ed92b3b79483d2ade727ea5773bd; output-bytes=77; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\vosil\Desktop\fond_uz\fond-uz-frontend; path=b11ea96863f8/44 entries

- [x] G2: frontend lint completes without errors
  CHECK: rtk npm run lint
  EXPECT: LINT_PASSED
  CWD: .
  EVIDENCE: automatic-evidence=v1; definition-sha256=6bf93742025cb859c67967772bce09955cc1236cc5053255a51c8c2e4ab33653; exit=0; EXPECT=matched; output-sha256=b301af7487d6713dd95018015950b137de35f49f43f71bcd022b2e69e8631489; output-bytes=61; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\vosil\Desktop\fond_uz\fond-uz-frontend; path=b11ea96863f8/44 entries

- [x] G3: production dependencies have no high or critical advisories
  CHECK: rtk npm audit --omit=dev --audit-level=high
  EXPECT: found 0 vulnerabilities
  CWD: .
  EVIDENCE: automatic-evidence=v1; definition-sha256=7e9c90e93a8648a89fde47833b816c07d9d700d9c29d40d891d517510778f9c5; exit=0; EXPECT=matched; output-sha256=6d8c5c8f3d7684adb070417bd608d01ae90aa3dc26a65af03ffda4955f38d9a3; output-bytes=24; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\vosil\Desktop\fond_uz\fond-uz-frontend; path=b11ea96863f8/44 entries

- [x] G4: frontend and admin locale dictionaries are complete and served in sync
  CHECK: rtk npm run i18n:check
  EXPECT: I18N_AUDIT_PASSED
  CWD: .
  EVIDENCE: automatic-evidence=v1; definition-sha256=b7a670f61d913e3d5d98f473015f8d7a82fd1de586aa2150c5d8df83a0f1c6b5; exit=0; EXPECT=matched; output-sha256=ee72ee3a6952031f4296f69e6c75aea1b8a4953e7ad81faeae557bf4f28d40bc; output-bytes=114; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\vosil\Desktop\fond_uz\fond-uz-frontend; path=b11ea96863f8/44 entries

- [x] G5: production frontend build completes successfully
  CHECK: rtk powershell -NoProfile -File scripts/build-safe.ps1
  EXPECT: BUILD_PASSED
  CWD: .
  EVIDENCE: automatic-evidence=v1; definition-sha256=628d6b69d0c52631c76cbf90a5b8395dcc836111ddf1532dcdcf072606cb7524; exit=0; EXPECT=matched; output-sha256=1850ff4c2a3dd694b21366dad04c4f6172db825c39198ca523dc474ee5b3ec37; output-bytes=4105; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\vosil\Desktop\fond_uz\fond-uz-frontend; path=b11ea96863f8/44 entries

- [x] G6: homepage hero image is optimized for fast first load
  CHECK: rtk node scripts/optimize-hero-image.mjs --check
  EXPECT: HERO_IMAGE_OPTIMIZED
  CWD: .
  EVIDENCE: automatic-evidence=v1; definition-sha256=4e1c7f3893715ed8af15cf2b7fe2c4c3326e270103467aaa0f6f6fd91d144a01; exit=0; EXPECT=matched; output-sha256=375dce3ab0528a742de9d77acc56235b9cc08bdf57f3c5d4434bb3e00cb5dbb2; output-bytes=35; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\vosil\Desktop\fond_uz\fond-uz-frontend; path=b11ea96863f8/44 entries
