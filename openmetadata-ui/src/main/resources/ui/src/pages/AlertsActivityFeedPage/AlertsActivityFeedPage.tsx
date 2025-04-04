/*
 *  Copyright 2022 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { Card } from 'antd';
import { noop, trim } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/common/Loader/Loader';
import { AlertDetailsComponent } from '../../components/Settings/Alerts/AlertsDetails/AlertDetails.component';
import { EventFilterRule } from '../../generated/events/eventFilterRule';
import {
  EventSubscription,
  FilteringRules,
} from '../../generated/events/eventSubscription';
import { withPageLayout } from '../../hoc/withPageLayout';
import { getAlertsFromName } from '../../rest/alertsAPI';
import { getEntityName } from '../../utils/EntityUtils';
import i18n from '../../utils/i18next/LocalUtil';
import { showErrorToast } from '../../utils/ToastUtils';

const AlertsActivityFeedPage = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<EventSubscription>();
  const { t } = useTranslation();
  const fetchActivityFeedAlert = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAlertsFromName('ActivityFeedAlert');

      const requestFilteringRules =
        response.filteringRules?.rules?.map((curr) => {
          const [fullyQualifiedName, filterRule] = curr.condition.split('(');

          return {
            ...curr,
            fullyQualifiedName,
            condition: filterRule
              .replaceAll("'", '')
              .replace(new RegExp(`\\)`), '')
              .split(',')
              .map(trim),
          } as unknown as EventFilterRule;
        }) ?? [];

      setAlert({
        ...response,
        filteringRules: {
          ...(response.filteringRules as FilteringRules),
          rules: requestFilteringRules,
        },
      });
    } catch (error) {
      showErrorToast(
        t('server.entity-fetch-error', {
          entity: t('label.activity-feed-plural'),
        })
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivityFeedAlert();
  }, []);

  const pageHeaderData = useMemo(
    () => ({
      header: getEntityName(alert),
      subHeader: alert?.description || '',
    }),
    [alert]
  );

  if (loading) {
    return <Card loading={loading} />;
  }

  return alert ? (
    <AlertDetailsComponent
      alerts={alert}
      allowDelete={false}
      pageHeaderData={pageHeaderData}
      onDelete={noop}
    />
  ) : (
    <Loader />
  );
};

export default withPageLayout(i18n.t('label.alert-details'))(
  AlertsActivityFeedPage
);
