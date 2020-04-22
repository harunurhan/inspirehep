# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# inspirehep is free software; you can redistribute it and/or modify it under
# the terms of the MIT License; see LICENSE file for more details.


import json

import pytest
from invenio_accounts.testutils import login_user_via_session
from invenio_db import db

from inspirehep.accounts.roles import Roles
from inspirehep.records.api import LiteratureRecord


@pytest.fixture(scope="function")
def record_with_two_revisions(app, create_record, clear_environment):
    record_data = {
        "$schema": "http://localhost:5000/schemas/records/hep.json",
        "control_number": 111,
        "document_type": ["article"],
        "titles": [{"title": "record rev0"}],
        "self": {"$ref": "http://localhost:5000/schemas/records/hep.json"},
        "_collections": ["Literature"],
    }

    record = create_record("lit", data=record_data)
    db.session.commit()

    record_data["titles"][0]["title"] = "record rev1"

    record.update(record_data)
    db.session.commit()


def test_get_revisions_requires_authentication(app, client, record_with_two_revisions):
    response = client.get(
        "/api/editor/literature/111/revisions", content_type="application/json"
    )

    assert response.status_code == 401


def test_get_revisions_with_error(app, client, create_user):
    user = create_user(role=Roles.cataloger.value)
    login_user_via_session(client, email=user.email)

    response = client.get(
        "/api/editor/literature/555/revisions", content_type="application/json"
    )

    assert response.status_code == 400


def test_get_revisions(app, client, create_user, record_with_two_revisions):
    user = create_user(role=Roles.cataloger.value)
    login_user_via_session(client, email=user.email)

    response = client.get(
        "/api/editor/literature/111/revisions", content_type="application/json"
    )

    assert response.status_code == 200

    result = json.loads(response.data)

    assert result[0]["revision_id"] == 2
    assert result[1]["revision_id"] == 1

    assert result[0]["user_email"] == "system"
    assert result[1]["user_email"] == "system"


def test_revert_to_revision_requires_authentication(
    app, client, record_with_two_revisions
):
    response = client.put(
        "/api/editor/literature/111/revisions/revert",
        content_type="application/json",
        data=json.dumps({"revision_id": 0}),
    )

    assert response.status_code == 401


def test_revert_to_revision_with_error(app, client, create_user):
    user = create_user(role=Roles.cataloger.value)
    login_user_via_session(client, email=user.email)

    response = client.put(
        "/api/editor/literature/555/revisions/revert",
        content_type="application/json",
        data=json.dumps({"revision_id": 0}),
    )

    assert response.status_code == 400


def test_revert_to_revision(app, client, create_user, record_with_two_revisions):
    user = create_user(role=Roles.cataloger.value)
    login_user_via_session(client, email=user.email)

    record = LiteratureRecord.get_record_by_pid_value(111)

    assert record["titles"][0]["title"] == "record rev1"

    response = client.put(
        "/api/editor/literature/111/revisions/revert",
        content_type="application/json",
        data=json.dumps({"revision_id": 0}),
    )

    assert response.status_code == 200

    record = LiteratureRecord.get_record_by_pid_value(111)

    assert record["titles"][0]["title"] == "record rev0"


def test_get_revision_requires_authentication(app, client, record_with_two_revisions):
    record = LiteratureRecord.get_record_by_pid_value(111)

    transaction_id_of_first_rev = record.revisions[0].model.transaction_id
    rec_uuid = record.id

    response = client.get(
        "/api/editor/revisions/"
        + str(rec_uuid)
        + "/"
        + str(transaction_id_of_first_rev),
        content_type="application/json",
    )

    assert response.status_code == 401


def test_get_revision_with_error(app, client, create_user, record_with_two_revisions):
    user = create_user(role=Roles.cataloger.value)
    login_user_via_session(client, email=user.email)

    record = LiteratureRecord.get_record_by_pid_value(111)
    rec_uuid = record.id

    wrong_transaction_id = 88

    response = client.get(
        "/api/editor/revisions/" + str(rec_uuid) + "/" + str(wrong_transaction_id),
        content_type="application/json",
    )

    assert response.status_code == 400


def test_get_revision(app, client, create_user, record_with_two_revisions):
    user = create_user(role=Roles.cataloger.value)
    login_user_via_session(client, email=user.email)

    record = LiteratureRecord.get_record_by_pid_value(111)

    transaction_id_of_first_rev = record.revisions[0].model.transaction_id
    rec_uuid = record.id

    response = client.get(
        "/api/editor/revisions/"
        + str(rec_uuid)
        + "/"
        + str(transaction_id_of_first_rev),
        content_type="application/json",
    )

    assert response.status_code == 200

    result = json.loads(response.data)

    assert result["titles"][0]["title"] == "record rev0"