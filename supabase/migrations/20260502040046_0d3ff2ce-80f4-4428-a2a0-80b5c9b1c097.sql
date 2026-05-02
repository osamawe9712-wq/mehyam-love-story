-- 1) Analytics events table
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  page_path TEXT,
  user_agent TEXT,
  referrer TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_events_name ON public.analytics_events(event_name);
CREATE INDEX idx_analytics_events_created ON public.analytics_events(created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins read events"
  ON public.analytics_events FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete events"
  ON public.analytics_events FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 2) Attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  check_in TIMESTAMPTZ NOT NULL DEFAULT now(),
  check_out TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_attendance_user ON public.attendance(user_id);
CREATE INDEX idx_attendance_check_in ON public.attendance(check_in DESC);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff insert own attendance"
  ON public.attendance FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_admin_or_staff(auth.uid()));

CREATE POLICY "Staff view own, admin view all"
  ON public.attendance FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Staff update own open record, admin update all"
  ON public.attendance FOR UPDATE
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin delete attendance"
  ON public.attendance FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER attendance_updated_at
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3) Financial records (income / expense)
CREATE TYPE public.financial_type AS ENUM ('income', 'expense');

CREATE TABLE public.financial_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type public.financial_type NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  category TEXT,
  description TEXT,
  occurred_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_financial_occurred ON public.financial_records(occurred_at DESC);
CREATE INDEX idx_financial_type ON public.financial_records(type);

ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage financial"
  ON public.financial_records FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER financial_updated_at
  BEFORE UPDATE ON public.financial_records
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();