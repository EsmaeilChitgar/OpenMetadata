#  Copyright 2021 Collate
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#  http://www.apache.org/licenses/LICENSE-2.0
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.

"""
This script generates the Python models from the JSON Schemas definition. Additionally, it replaces the `SecretStr`
pydantic class used for the password fields with the `CustomSecretStr` pydantic class which retrieves the secrets
from a configured secrets' manager.
"""

import datamodel_code_generator.model.pydantic
from datamodel_code_generator.imports import Import
import os



datamodel_code_generator.model.pydantic.types.IMPORT_SECRET_STR = Import.from_full_path(
    "metadata.ingestion.models.custom_pydantic.CustomSecretStr"
)

from datamodel_code_generator.__main__ import main

current_directory = os.getcwd()
ingestion_path = "./" if current_directory.endswith("/ingestion") else "ingestion/"
directory_root = "../" if current_directory.endswith("/ingestion") else "./"

UNICODE_REGEX_REPLACEMENT_FILE_PATHS = [
    f"{ingestion_path}src/metadata/generated/schema/entity/classification/tag.py",
    f"{ingestion_path}src/metadata/generated/schema/entity/events/webhook.py",
    f"{ingestion_path}src/metadata/generated/schema/entity/teams/user.py",
    f"{ingestion_path}src/metadata/generated/schema/entity/type.py",
    f"{ingestion_path}src/metadata/generated/schema/type/basic.py",
]

args = f"--input {directory_root}openmetadata-spec/src/main/resources/json/schema --input-file-type jsonschema --output {ingestion_path}src/metadata/generated/schema --set-default-enum-member".split(" ")

main(args)

for file_path in UNICODE_REGEX_REPLACEMENT_FILE_PATHS:
    with open(file_path, "r", encoding="UTF-8") as file_:
        content = file_.read()
        # Python now requires to move the global flags at the very start of the expression
        content = content.replace("^(?U)", "(?u)^")
    with open(file_path, "w", encoding="UTF-8") as file_:
        file_.write(content)
