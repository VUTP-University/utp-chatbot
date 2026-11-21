import { useTranslation } from 'react-i18next'
import { useBotStatus } from '../hooks/useBotStatus'
import SignalBars from './SignalBars'

// status prop: if provided, skips internal polling (avoids duplicate /api/health calls)
export default function StatusIndicator({ intervalMs, status: statusProp }) {
  const { t } = useTranslation()
  const hookStatus = useBotStatus(statusProp !== undefined ? null : intervalMs)
  const status = statusProp ?? hookStatus

  return (
    <div className={`status status--${status}`}>
      <SignalBars status={status} />
      {t(`status.${status}`)}
    </div>
  )
}
