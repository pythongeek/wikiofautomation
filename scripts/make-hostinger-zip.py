import zipfile
import os

zip_name = 'wikiofautomation_20260811_035500.zip'
src_dir = 'dist/client'

with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(src_dir):
        for f in files:
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, src_dir).replace('\\', '/')
            zf.write(full_path, rel_path)

size_mb = os.path.getsize(zip_name) / (1024 * 1024)
print(f"Created Hostinger formatted zip {zip_name}: {size_mb:.2f} MB ({len(zf.namelist())} files)")
