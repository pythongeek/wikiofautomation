import zipfile
import os

zip_filename = 'wikiofautomation_source_clean.zip'
skip_dirs = {'node_modules', 'dist', '.astro', '.git', '.gemini', 'brain', '.tempmediaStorage'}

with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk('.'):
        # Prune skipped directories
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for f in files:
            if f.endswith('.zip') or f.endswith('.tar.gz'):
                continue
            rel_path = os.path.relpath(os.path.join(root, f), '.').replace('\\', '/')
            zf.write(os.path.join(root, f), rel_path)

size_mb = os.path.getsize(zip_filename) / (1024 * 1024)
print(f"Clean source zip created successfully: {size_mb:.2f} MB ({len(zf.namelist())} files)")
