import { Icon, IconName } from "@marwes-ui/react"
import styled from "styled-components"

import type { RecommendedComponent } from "./component-docs-model"

const Card = styled.article`
  display: flex;
  align-items: center;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.sp12};
  padding: ${({ theme }) => theme.spacing.sp12};
  border: 0.0625rem solid ${({ theme }) => theme.color.borderLow};
  border-radius: ${({ theme }) => theme.spacing.sp8};
  background: ${({ theme }) => theme.color.surfaceElevated};

  > span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${({ theme }) => theme.spacing.sp40};
    height: ${({ theme }) => theme.spacing.sp40};
    flex: 0 0 auto;
    border-radius: ${({ theme }) => theme.spacing.sp8};
    background: ${({ theme }) => theme.color.surfaceBrand};
    color: ${({ theme }) => theme.color.textBrand};
  }

  h3 {
    overflow: hidden;
    margin: 0;
    font-size: 0.75rem;
    text-overflow: ellipsis;
  }

  p {
    margin: ${({ theme }) => theme.spacing.sp2} 0 0;
    color: ${({ theme }) => theme.color.textMuted};
    font-size: 0.6875rem;
    line-height: 1.35;
  }
`

const iconsByComponent: Partial<Record<string, IconName>> = {
  BadgeGroup: IconName.Tag,
  ButtonSpinner: IconName.RefreshCw,
  Card: IconName.Layout,
  DestructiveButton: IconName.Trash,
  Divider: IconName.Slash,
  EmailField: IconName.Mail,
  EmptyStateSpinner: IconName.RefreshCw,
  ErrorBanner: IconName.AlertOctagon,
  IconButton: IconName.PlusSquare,
  InfoBanner: IconName.Info,
  LinkButton: IconName.Link,
  NotificationBadge: IconName.Bell,
  PasswordField: IconName.Lock,
  PriorityBadge: IconName.Flag,
  PrimaryButton: IconName.CheckCircle,
  ProductCard: IconName.ShoppingBag,
  ProfileCard: IconName.UserCircle,
  ProgressBar: IconName.BarChart,
  SearchField: IconName.Search,
  SecondaryButton: IconName.Square,
  SelectField: IconName.ChevronDown,
  Skeleton: IconName.Layout3,
  Spinner: IconName.RefreshCw,
  StatCard: IconName.LineChart,
  StatusBadge: IconName.CheckCircle,
  SubmitButton: IconName.Save,
  SuccessBanner: IconName.CheckCircle,
  TextareaField: IconName.Edit,
  InputOtpField: IconName.Command,
  WarningBanner: IconName.AlertTriangle,
}

function ComponentCard({ component }: { component: RecommendedComponent }): JSX.Element {
  return (
    <Card>
      <span>
        <Icon name={iconsByComponent[component.name] ?? IconName.Sliders} decorative size="sm" />
      </span>
      <div>
        <h3>{component.name}</h3>
        <p>{component.description}</p>
      </div>
    </Card>
  )
}

export { ComponentCard }
