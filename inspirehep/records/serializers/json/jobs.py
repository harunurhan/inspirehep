# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# inspirehep is free software; you can redistribute it and/or modify it under
# the terms of the MIT License; see LICENSE file for more details.

from invenio_records_rest.serializers.response import search_responsify

from inspirehep.records.marshmallow.base import wrapSchemaClassWithMetadata
from inspirehep.records.marshmallow.jobs import JobsPublicSchema
from inspirehep.records.serializers.response import record_responsify
from inspirehep.serializers import JSONSerializer

jobs_json = JSONSerializer(
    wrapSchemaClassWithMetadata(JobsPublicSchema), index_name="records-jobs"
)

jobs_json_response = record_responsify(jobs_json, "application/json")

jobs_json_response_search = search_responsify(jobs_json, "application/json")
