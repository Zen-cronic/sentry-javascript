import { KnexInstrumentation } from '@opentelemetry/instrumentation-knex';
import { SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, defineIntegration, spanToJSON } from '@sentry/core';
import type { IntegrationFn } from '@sentry/types';
import { generateInstrumentOnce } from '../../otel/instrument';

const INTEGRATION_NAME = 'Knex';

export const instrumentKnex = generateInstrumentOnce(
  INTEGRATION_NAME,
  () => new KnexInstrumentation({ requireParentSpan: true }),
);

const _knexIntegration = (() => {
  return {
    name: INTEGRATION_NAME,
    setupOnce() {
      instrumentKnex();
    },

    setup(client) {
      client.on('spanStart', span => {
        const spanJSON = spanToJSON(span);
        const spanData = spanJSON.data;

        if (spanData && 'knex.version' in spanData) {
          span.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, 'auto.db.otel.knex');
          span.setAttribute('db.system', 'knex');
        }
      });
    },
  };
}) satisfies IntegrationFn;

/**
 * Knex integration
 *
 * Capture tracing data for Knex.
 */
export const knexIntegration = defineIntegration(_knexIntegration);
