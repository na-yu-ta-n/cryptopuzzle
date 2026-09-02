import { useRef, useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Snackbar, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddIcon from '@mui/icons-material/Add';
import { useAppStore } from '../stores/useAppStore';
import defaultMaterials from '../data/defaultMaterials.json';
import { CATEGORY_LABELS } from '../utils/labels';
import type { Material } from '../types';

export default function MaterialManager() {
  const { customMaterials, importMaterials, setScreen } = useAppStore();
  const [json, setJson] = useState('');
  const [snack, setSnack] = useState<{ open: boolean; message: string; ok: boolean }>({ open: false, message: '', ok: true });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImportText = () => {
    try {
      const parsed = JSON.parse(json);
      const result = importMaterials(parsed);
      setSnack({ open: true, message: result.message, ok: result.ok });
      if (result.ok) setJson('');
    } catch (err) {
      setSnack({ open: true, message: `JSONの形式が正しくありません: ${err}`, ok: false });
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        const result = importMaterials(parsed);
        setSnack({ open: true, message: result.message, ok: result.ok });
      } catch (err) {
        setSnack({ open: true, message: `読み込み失敗: ${err}`, ok: false });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const allMaterials = [...defaultMaterials, ...customMaterials] as Material[];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={() => setScreen('start')}>
          戻る
        </Button>
        <Typography variant='h4' style={{ fontWeight: 800 }}>
          教材データ
        </Typography>
      </Box>

      <Typography variant='body1' color='text.secondary'>
        JSONファイルまたはテキストで独自の教材を追加できます。  
        例: <code>[{`{"en":"Hello","ja":"こんにちは","category":"daily"}`}]</code>
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <TextField
          multiline
          rows={6}
          fullWidth
          value={json}
          onChange={(e) => setJson(e.target.value)}
          placeholder='JSONを貼り付け...'
          sx={{
            minWidth: 260,
            flex: 1,
            '& .MuiInputBase-root': {
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 3,
              p: 1.5,
            },
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 180 }}>
          <Button variant='contained' startIcon={<AddIcon />} onClick={handleImportText}>
            追加
          </Button>
          <Button variant='outlined' startIcon={<FileUploadIcon />} onClick={() => fileInputRef.current?.click()}>
            ファイル読込
          </Button>
          <input ref={fileInputRef} type='file' accept='.json' onChange={handleFile} style={{ display: 'none' }} />
        </Box>
      </Box>

      <Typography variant='h6' style={{ fontWeight: 700 }}>
        登録済み教材 ({allMaterials.length})
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pb: 4 }}>
        {allMaterials.map((m) => (
          <Card
            key={m.id}
            sx={{
              borderRadius: 3,
              background: 'rgba(255,255,255,0.05)',
              p: 1.5,
            }}
          >
            <CardContent sx={{ p: '8px !important' }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                {m.category && <Chip label={CATEGORY_LABELS[m.category] ?? m.category} size='small' color='secondary' />}
                <Chip label={m.difficulty ?? 'medium'} size='small' color='info' />
              </Box>
              <Typography variant='body1' style={{ fontWeight: 700 }}>
                {m.en}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {m.ja}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        message={snack.message}
      />
    </Box>
  );
}
