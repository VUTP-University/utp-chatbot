import { useTranslation } from 'react-i18next'
import { useBotStatus } from '../hooks/useBotStatus'

const DOT_COLOUR = {
  online:     'var(--color-success)',
  offline:    'var(--color-danger)',
  connecting: 'var(--color-warning)',
}

const TEXT_COLOUR = {
  online:     'var(--color-success)',
  offline:    'var(--color-danger)',
  connecting: 'var(--color-warning)',
}

export default function StatusIndicator({ intervalMs }) {
  const { t } = useTranslation()
  const status = useBotStatus(intervalMs)

  return (
    <div style={{ fontSize: '0.75rem', color: TEXT_COLOUR[status], display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: DOT_COLOUR[status],
        display: 'inline-block',
        animation: status === 'connecting' ? 'pulse 1.5s ease-in-out infinite' : 'none',
      }} />
      {t(`status.${status}`)}
    </div>
  )
}
