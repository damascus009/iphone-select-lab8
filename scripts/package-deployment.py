"""Copy only the reviewed runtime manifest into the CI deployment directory."""
from pathlib import Path
import json, subprocess, shutil
root = Path(__file__).resolve().parents[1]
output = root / '.deploy-rgr'
if output.exists(): shutil.rmtree(output)
for item in json.loads(subprocess.check_output(['python3', 'scripts/deploy-manifest.py'], cwd=root)):
    source = root / item['file']
    dest = output / item['file']
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, dest)
print('Packaged public runtime files into .deploy-rgr')
